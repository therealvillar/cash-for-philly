interface D1Statement {
  bind(...values: (string | number | null)[]): { run(): Promise<{ success: boolean }> };
}
interface D1Database {
  prepare(sql: string): D1Statement;
}
interface Env {
  LEADS_DB?: D1Database;
  TURNSTILE_SECRET_KEY?: string;
}
interface PagesContext {
  request: Request;
  env: Env;
}

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'X-Frame-Options': 'DENY'
};
const respond = (status: number, message: string, id?: string) =>
  new Response(JSON.stringify({ message, ...(id ? { id } : {}) }), { status, headers });
const field = (data: Record<string, unknown>, key: string, limit: number) => {
  const value = data[key];
  return typeof value === 'string' && value.length <= limit ? value.trim() : null;
};
const optional = (data: Record<string, unknown>, key: string, limit: number) =>
  data[key] === undefined || data[key] === '' ? '' : field(data, key, limit);
async function readLimitedBody(request: Request): Promise<string | null> {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 12_000) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}

async function handlePost({ request, env }: PagesContext): Promise<Response> {
  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin || request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') {
    return respond(403, 'Request origin or format is not allowed.');
  }
  if (!env.LEADS_DB || !env.TURNSTILE_SECRET_KEY) return respond(503, 'Form service is not configured. Please try again later.');
  if (Number(request.headers.get('Content-Length')) > 12_000) return respond(413, 'Submission is too large.');
  let data: Record<string, unknown>;
  try {
    const body = await readLimitedBody(request);
    if (body === null) return respond(413, 'Submission is too large.');
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw Error('Invalid body');
    data = parsed as Record<string, unknown>;
  } catch {
    return respond(400, 'Invalid submission.');
  }
  const leadType = field(data, 'lead_type', 20);
  const name = field(data, 'name', 120);
  const email = optional(data, 'email', 254);
  const phone = optional(data, 'phone', 30);
  const location = optional(data, 'property_location', 240);
  const city = optional(data, 'city', 80);
  const zip = optional(data, 'zip', 10);
  const propertyType = optional(data, 'property_type', 40);
  const message = field(data, 'message', 2000);
  const method = field(data, 'preferred_contact', 10);
  const source = field(data, 'source_path', 100);
  const token = field(data, 'turnstile_token', 2048);
  const key = field(data, 'submission_key', 64);
  const honeypot = optional(data, 'website', 100);
  if (honeypot) return respond(400, 'Invalid submission.');
  if (
    !['seller', 'agent', 'contact'].includes(leadType || '') ||
    !name || !message || !['email', 'phone'].includes(method || '') ||
    !email && !phone || !source || !['/sell-your-house/', '/agents/', '/contact/'].includes(source) ||
    (leadType === 'seller' && source !== '/sell-your-house/') ||
    (leadType === 'agent' && source !== '/agents/') ||
    (leadType === 'contact' && source !== '/contact/') ||
    (leadType !== 'contact' && (!location || !city || !zip || !propertyType)) ||
    !token || !key || !/^[0-9a-f-]{36}$/i.test(key) ||
    email === null || phone === null || location === null || city === null || zip === null || propertyType === null ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '') && !!email ||
    !!phone && !/^\+?[0-9() .-]{7,30}$/.test(phone) ||
    !!zip && !/^\d{5}(?:-\d{4})?$/.test(zip) ||
    !['house','rental','multi-unit','land','other','not-specified'].includes(propertyType || '') && leadType !== 'contact' ||
    (method === 'email' && !email) || (method === 'phone' && !phone) ||
    typeof data.marketing_consent !== 'boolean'
  ) return respond(400, 'Please review the required fields and contact information.');

  const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].map(k => optional(data, k, 100));
  if (utm.some(v => v === null)) return respond(400, 'Invalid campaign information.');
  let verification: { success?: boolean; hostname?: string; action?: string };
  try {
    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, idempotency_key: key }),
      signal: AbortSignal.timeout(5000)
    });
    if (!result.ok) throw Error('Verification unavailable');
    verification = await result.json() as typeof verification;
  } catch {
    return respond(503, 'Verification is unavailable. Please try again.');
  }
  if (!verification.success || verification.hostname !== url.hostname || verification.action !== 'lead') {
    return respond(400, 'Verification failed. Please retry the challenge.');
  }
  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  try {
    const result = await env.LEADS_DB.prepare(
      `INSERT INTO leads (id, submission_key, lead_type, name, email, phone, property_location, city, zip, property_type, message, preferred_contact, source_path, created_at, utm_source, utm_medium, utm_campaign, utm_content, utm_term, marketing_consent, marketing_consent_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, key, leadType!, name, email ? email.toLowerCase() : null, phone || null, location || null, city || null, zip || null, propertyType || null, message, method!, source!, timestamp, ...utm.map(v => v || null), data.marketing_consent ? 1 : 0, data.marketing_consent ? timestamp : null, 'new').run();
    if (!result.success) throw Error('Storage failed');
  } catch (error) {
    if (error instanceof Error && /unique constraint/i.test(error.message)) return respond(409, 'This submission has already been received.');
    return respond(503, 'Your inquiry could not be saved. Please try again later.');
  }
  return respond(201, 'Your inquiry was received.', id);
}

export function onRequest(context: PagesContext): Promise<Response> | Response {
  if (context.request.method !== 'POST') return respond(405, 'Method not allowed.');
  return handlePost(context);
}
