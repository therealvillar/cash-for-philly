import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onRequest } from '../../functions/api/leads';

const origin = 'https://cashforphilly.com';
const payload = () => ({
  lead_type: 'seller', name: 'Synthetic Test', email: 'TEST@EXAMPLE.COM', phone: '',
  property_location: '100 Example Lane', city: 'Philadelphia', zip: '19101',
  property_type: 'house', message: '<script>alert(1)</script>', preferred_contact: 'email',
  source_path: '/sell-your-house/', marketing_consent: false,
  turnstile_token: 'verified-token', submission_key: crypto.randomUUID(),
  utm_source: 'campaign'
});
const request = (body: unknown, options: { origin?: string; method?: string; contentType?: string } = {}) =>
  new Request(`${origin}/api/leads`, {
    method: options.method || 'POST',
    headers: { Origin: options.origin ?? origin, 'Content-Type': options.contentType ?? 'application/json' },
    body: options.method === 'GET' ? undefined : JSON.stringify(body)
  });
const db = () => {
  const run = vi.fn(async () => ({ success: true }));
  const bind = vi.fn((..._values: (string | number | null)[]) => ({ run }));
  const prepare = vi.fn((_sql: string) => ({ bind }));
  return { run, bind, prepare };
};
const submit = (body: unknown, database: ReturnType<typeof db> | null = db(), options = {}) =>
  onRequest({ request: request(body, options), env: { LEADS_DB: database ?? undefined, TURNSTILE_SECRET_KEY: 'test-only-secret' } });

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({
    success: true, hostname: 'cashforphilly.com', action: 'lead'
  }), { status: 200 })));
});
afterEach(() => vi.unstubAllGlobals());

describe('POST /api/leads', () => {
  it('stores exactly once, normalizes email, and confirms only after D1 success', async () => {
    const database = db();
    const result = await submit(payload(), database);
    expect(result.status).toBe(201);
    expect((await result.json()).id).toMatch(/^[0-9a-f-]{36}$/);
    expect(database.run).toHaveBeenCalledOnce();
    expect(database.bind.mock.calls[0]).toContain('test@example.com');
    expect(database.bind.mock.calls[0]).toContain(0);
    expect(database.bind.mock.calls[0]).toContain(null);
    expect(result.headers.get('Cache-Control')).toBe('no-store');
  });
  it.each([
    ['invalid body', []],
    ['missing contact', { ...payload(), email: '' }],
    ['wrong preference', { ...payload(), preferred_contact: 'phone' }],
    ['invalid ZIP', { ...payload(), zip: 'not-a-zip' }],
    ['oversized message', { ...payload(), message: 'x'.repeat(2001) }],
    ['cross-funnel source', { ...payload(), lead_type: 'agent' }]
  ])('rejects %s', async (_name, value) => {
    const database = db();
    expect((await submit(value, database)).status).toBe(400);
    expect(database.run).not.toHaveBeenCalled();
  });
  it('rejects missing origin and does not write', async () => {
    const database = db();
    expect((await submit(payload(), database, { origin: 'https://other.example' })).status).toBe(403);
    expect(database.run).not.toHaveBeenCalled();
  });
  it('rejects oversized requests before verification or storage', async () => {
    const database = db();
    const result = await submit({ ...payload(), message: 'x'.repeat(13_000) }, database);
    expect(result.status).toBe(413);
    expect(database.run).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
  it('rejects invalid challenge hostname/action without writing', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: true, hostname: 'other.example', action: 'lead' }))));
    const database = db();
    expect((await submit(payload(), database)).status).toBe(400);
    expect(database.run).not.toHaveBeenCalled();
  });
  it('fails closed when database or secret is missing', async () => {
    expect((await submit(payload(), null)).status).toBe(503);
    const database = db();
    const response = await onRequest({ request: request(payload()), env: { LEADS_DB: database } });
    expect(response.status).toBe(503);
    expect(database.run).not.toHaveBeenCalled();
  });
  it('reports D1 failure without a receipt', async () => {
    const database = db();
    database.run.mockRejectedValueOnce(new Error('database unavailable'));
    const result = await submit(payload(), database);
    expect(result.status).toBe(503);
    expect((await result.json()).id).toBeUndefined();
  });
  it('rejects duplicate idempotency keys with no second receipt', async () => {
    const database = db();
    database.run.mockRejectedValueOnce(new Error('UNIQUE constraint failed: leads.submission_key'));
    const result = await submit(payload(), database);
    expect(result.status).toBe(409);
    expect((await result.json()).id).toBeUndefined();
  });
  it('preserves malicious text as data only via prepared bindings', async () => {
    const database = db();
    const body = payload();
    const response = await submit(body, database);
    expect(response.status).toBe(201);
    expect(database.prepare.mock.calls[0][0]).not.toContain(body.message);
    expect(database.bind.mock.calls[0]).toContain(body.message);
  });
  it('rejects non-POST requests', async () => {
    const result = await onRequest({ request: request(null, { method: 'GET' }), env: {} });
    expect(result.status).toBe(405);
  });
});
