import { afterEach, describe, expect, it } from 'vitest';
import { sanitizeSearchTerm, searchCompanyDirectory, SEARCH_MAX_RESULTS, SUGGESTION_MAX_RESULTS } from './companySearch';

afterEach(() => { delete process.env.CNPJ_WS_API_TOKEN; });

describe('company search service', () => {
  it('sanitizes malicious and oversized input', () => {
    expect(sanitizeSearchTerm('<script>alert(1)</script>')).not.toContain('<');
    expect(sanitizeSearchTerm('x'.repeat(1000))).toHaveLength(120);
  });

  it('searches fallback by company name or trade name', async () => {
    const result = await searchCompanyDirectory('magazine', {}, 1);
    expect(result.source).toBe('fallback');
    expect(result.data.some((company) => company.nomeFantasia === 'MAGAZINE LUIZA')).toBe(true);
  });

  it('combines filters and returns no result for an impossible combination', async () => {
    const match = await searchCompanyDirectory('transporte', { uf: 'SP', status: 'ATIVA' }, 1);
    expect(match.data.some((company) => company.cnpj === '19210785000155')).toBe(true);
    const missing = await searchCompanyDirectory('magazine', { uf: 'RJ', status: 'BAIXADA' }, 1);
    expect(missing.data).toEqual([]);
  });

  it('enforces server-side result limits', () => {
    expect(SEARCH_MAX_RESULTS).toBeLessThanOrEqual(50);
    expect(SUGGESTION_MAX_RESULTS).toBe(8);
  });
});
