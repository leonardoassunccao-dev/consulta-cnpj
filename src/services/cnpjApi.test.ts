import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanCnpj, fetchCnpj, validateCnpjFormat } from './cnpjApi';

afterEach(() => vi.unstubAllGlobals());

describe('CNPJ public API client', () => {
  it('accepts formatted and unformatted traditional CNPJs', () => {
    expect(cleanCnpj('47.960.950/0001-21')).toBe('47960950000121');
    expect(validateCnpjFormat('47960950000121')).toBe(true);
  });

  it.each(['', 'TELOG', '123'])('rejects invalid input without making a request: %s', async (input) => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const result = await fetchCnpj(input);
    expect(result.errorType).toBe('INVALID_CNPJ');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns a company even when optional data is incomplete', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ razao_social: 'EMPRESA TESTE' }), { status: 200 })));
    const result = await fetchCnpj('47960950000121');
    expect(result).toMatchObject({ success: true, data: { razao_social: 'EMPRESA TESTE' } });
  });

  it('maps not found, rate limit and provider timeout safely', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'missing' }), { status: 404 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'limited' }), { status: 429 }))
      .mockRejectedValueOnce(Object.assign(new Error('timeout'), { name: 'AbortError' }));
    vi.stubGlobal('fetch', fetchMock);

    expect((await fetchCnpj('47960950000121')).errorType).toBe('NOT_FOUND');
    expect((await fetchCnpj('47960950000121')).errorType).toBe('API_ERROR');
    expect((await fetchCnpj('47960950000121')).errorType).toBe('TIMEOUT');
  });
});
