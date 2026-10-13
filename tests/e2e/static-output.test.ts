import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, beforeAll } from 'vitest';

const routes = ['/', '/sell-your-house/', '/how-it-works/', '/agents/', '/investors/', '/areas/', '/about/', '/contact/', '/privacy/', '/terms/', '/thank-you/'];
const dist = join(process.cwd(), 'dist');
const htmlFor = (route: string) => readFileSync(join(dist, route, 'index.html'), 'utf8');

beforeAll(() => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { stdio: 'pipe' });
}, 20_000);

describe('built site route smoke checks', () => {
  it.each(routes)('generates %s with page metadata', route => {
    const html = htmlFor(route);
    expect(html).toContain('<h1');
    expect(html).toMatch(/<title>[^<]+ \| CashForPhilly<\/title>/);
    expect(html).toContain('name="description"');
    expect(html).toContain('rel="canonical"');
  });
  it('ships original art, sitemap, 404 and restricted Function routing', () => {
    expect(existsSync(join(dist, '404.html'))).toBe(true);
    expect(existsSync(join(dist, 'assets/brand/cashforphilly-original.png'))).toBe(true);
    expect(readFileSync(join(dist, 'sitemap.xml'), 'utf8')).toContain('https://cashforphilly.com/sell-your-house/');
    expect(JSON.parse(readFileSync(join(dist, '_routes.json'), 'utf8'))).toEqual({ version: 1, include: ['/api/*'], exclude: [] });
    expect(existsSync(join(dist, '_worker.js'))).toBe(false);
    expect(readdirSync(dist, { recursive: true }).map(String).some(path => path.includes('restricted'))).toBe(false);
  });
});
