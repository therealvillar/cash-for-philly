import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const lockfile = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));

describe('repository and Pages deployment configuration', () => {
  it('uses the canonical package identity and Node runtime', () => {
    expect(packageJson.name).toBe('cash-for-philly');
    expect(lockfile.name).toBe(packageJson.name);
    expect(lockfile.packages[''].name).toBe(packageJson.name);
    expect(packageJson.engines.node).toBe('>=24 <25');
  });

  it('keeps Astro static and Functions at the repository root', () => {
    expect(readFileSync(join(root, 'astro.config.mjs'), 'utf8')).toMatch(/output:\s*'static'/);
    expect(existsSync(join(root, 'functions/api/leads.ts'))).toBe(true);
    expect(JSON.parse(readFileSync(join(root, 'public/_routes.json'), 'utf8'))).toEqual({
      version: 1,
      include: ['/api/*'],
      exclude: []
    });
  });
});
