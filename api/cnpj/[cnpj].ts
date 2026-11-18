/**
 * Vercel Serverless Function for CNPJ search.
 * Path: /api/cnpj/[cnpj].ts
 */
import { allowRequest, requestIdentity } from '../_lib/rateLimit.js';
import { withProviderGuard } from '../_lib/providerGuard.js';
import { normalizeBrasilApi } from '../_lib/cnpjNormalizer.js';
import { readJsonWithStreamLimit, validateAndSanitizeCnpjData } from '../_lib/cnpjSchema.js';

function validCnpj(value: string): boolean {
  if (!/^\d{14}$/.test(value) || /^(\d)\1{13}$/.test(value)) return false;
  const digit = (base: string, weights: number[]) => {
    const sum = base.split('').reduce((total, item, index) => total + Number(item) * weights[index], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  const first = digit(value.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = digit(value.slice(0, 12) + first, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return value.endsWith(`${first}${second}`);
}

async function queryCnpjWithFallback(cnpjLimpo: string): Promise<{ ok: boolean; status: number; data?: any; error?: string; code?: string }> {
  // 1. Primary provider: publica.cnpj.ws
  try {
    const primaryRes = await withProviderGuard(() => fetch(`https://publica.cnpj.ws/cnpj/${cnpjLimpo}`, {
      method: 'GET',
      signal: AbortSignal.timeout(6_000),
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CNPJ-Lookup-Dashboard',
      },
    }));

    if (primaryRes.status === 404) {
      return { ok: false, status: 404, error: 'CNPJ não encontrado na base de dados.', code: 'NOT_FOUND' };
    }
    if (primaryRes.ok) {
      const data = await readJsonWithStreamLimit(primaryRes);
      const sanitized = validateAndSanitizeCnpjData(data);
      if (sanitized) {
        return { ok: true, status: 200, data: sanitized };
      }
    }
  } catch (err: any) {
    if (err?.message === 'PAYLOAD_TOO_LARGE') {
      console.error(`[CNPJ-API] [${cnpjLimpo}] Primary response exceeded 1MB stream limit.`);
      return { ok: false, status: 502, error: 'Resposta do provedor excedeu o limite máximo seguro de 1 MB.', code: 'PAYLOAD_TOO_LARGE' };
    }
    console.error(`[CNPJ-API] [${cnpjLimpo}] Primary provider error: ${err?.message || err}`);
  }

  // 2. Resilient fallback provider: BrasilAPI (open public API)
  try {
    const fallbackRes = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`, {
      method: 'GET',
      signal: AbortSignal.timeout(6_000),
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CNPJ-Lookup-Dashboard',
      },
    });

    if (fallbackRes.status === 404) {
      return { ok: false, status: 404, error: 'CNPJ não encontrado na base de dados.', code: 'NOT_FOUND' };
    }
    if (fallbackRes.ok) {
      const bData = await readJsonWithStreamLimit(fallbackRes);
      const normalized = normalizeBrasilApi(bData);
      const sanitized = validateAndSanitizeCnpjData(normalized);
      if (sanitized) {
        return { ok: true, status: 200, data: sanitized };
      }
    }
  } catch (err: any) {
    if (err?.message === 'PAYLOAD_TOO_LARGE') {
      console.error(`[CNPJ-API] [${cnpjLimpo}] Fallback response exceeded 1MB stream limit.`);
      return { ok: false, status: 502, error: 'Resposta do provedor excedeu o limite máximo seguro de 1 MB.', code: 'PAYLOAD_TOO_LARGE' };
    }
    console.error(`[CNPJ-API] [${cnpjLimpo}] Fallback provider error: ${err?.message || err}`);
  }

  return { ok: false, status: 504, error: 'O serviço de consulta da Receita Federal demorou para responder. Tente novamente em instantes.', code: 'PROVIDER_TIMEOUT' };
}

export default async function handler(req: any, res: any) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, HEAD, OPTIONS');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(204).end();
  }

  // We permit GET and HEAD requests
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD, OPTIONS');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(405).json({ error: 'Método não permitido. Use GET ou HEAD.', code: 'METHOD_NOT_ALLOWED' });
  }

  const clientIdentity = requestIdentity(req.headers, req.socket?.remoteAddress);
  if (!allowRequest(`company:${clientIdentity}`, 60)) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ error: 'Muitas consultas em sequência. Aguarde um instante.', code: 'RATE_LIMITED' });
  }

  // Extract CNPJ from query parameter
  const { cnpj } = req.query;

  if (!cnpj || typeof cnpj !== 'string') {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(400).json({ error: 'CNPJ não informado ou formato inválido.', code: 'INVALID_PARAM' });
  }

  // Clean and validate CNPJ digits
  const cnpjLimpo = cnpj.replace(/\D/g, '');

  if (!validCnpj(cnpjLimpo)) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(400).json({
      error: 'Digite um CNPJ válido.',
      code: 'INVALID_CNPJ',
    });
  }

  const result = await queryCnpjWithFallback(cnpjLimpo);

  if (!result.ok) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(result.status).json({ error: result.error, code: result.code });
  }

  // Cache successful responses only (30 minutes in edge cache)
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
  if (req.method === 'HEAD') {
    return res.status(200).end();
  }
  return res.status(200).json(result.data);
}
