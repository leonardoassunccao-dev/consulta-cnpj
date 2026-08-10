import { afterEach, describe, expect, it, vi } from 'vitest';
import { sanitizeSearchTerm, searchCompanyDirectory, SEARCH_MAX_RESULTS, SUGGESTION_MAX_RESULTS } from './companySearch';

afterEach(() => { delete process.env.CNPJ_WS_API_TOKEN; vi.restoreAllMocks(); });

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

  it('matches TELOG even when the stored legal name contains a space', async () => {
    const result = await searchCompanyDirectory('TELOG', {}, 1);
    expect(result.data[0]).toMatchObject({ cnpj: '19210785000155', city: 'Sertãozinho', uf: 'SP', status: 'ATIVA' });
    expect(result.notice).toBeUndefined();
  });

  it('keeps configuration details out of the public fallback response', async () => {
    const result = await searchCompanyDirectory('empresa inexistente', {}, 1);
    expect(result.notice).toContain('consulta por CNPJ continua disponível');
    expect(JSON.stringify(result)).not.toContain('CNPJ_WS_API_TOKEN');
  });

  it('accepts the documented commercial response containing CNPJ strings', async () => {
    process.env.CNPJ_WS_API_TOKEN = 'server-only-test-token';
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      paginacao: { tem_proxima_pagina: false },
      data: ['47960950000121'],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    const result = await searchCompanyDirectory('Magazine Luiza', {}, 1);
    expect(result.data[0]).toMatchObject({ cnpj: '47960950000121', razaoSocial: 'Magazine Luiza' });
    expect(result.source).toBe('commercial');
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({ x_api_token: 'server-only-test-token' });
    expect(JSON.stringify(result)).not.toContain('server-only-test-token');
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
