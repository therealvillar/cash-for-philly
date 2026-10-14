import { describe, expect, it } from 'vitest';
import { neighborhoods } from '../../src/data/neighborhoods';
import { faqs } from '../../src/data/faqs';
import { site } from '../../src/data/site';

describe('editorial data', () => {
  it('keeps the primary seller route and unverified contact state explicit', () => {
    expect(site.primaryHref).toBe('/sell-your-house/');
    expect(site.emailVerified).toBe(true);
    expect(site.legalIdentity).toContain('Anthony Villar');
    expect(site.licenseDisclosure).toContain('RS340087');
  });
  it('uses distinct original illustration names and substantive FAQ answers', () => {
    expect(new Set(neighborhoods.map(({ image }) => image)).size).toBe(neighborhoods.length);
    expect(neighborhoods.length).toBeGreaterThanOrEqual(6);
    expect(faqs.every(({ question, answer }) => question.length > 10 && answer.length > 25)).toBe(true);
  });
});
