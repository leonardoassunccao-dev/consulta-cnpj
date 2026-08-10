/**
 * Vercel Serverless Function for CNPJ search.
 * Path: /api/cnpj/[cnpj].ts
 */
import { allowRequest, requestIdentity } from '../_lib/rateLimit';
import { withProviderGuard } from '../_lib/providerGuard';

export default async function handler(req: any, res: any) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // We only permit GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido. Use GET.' });
  }
  if (!allowRequest(`company:${requestIdentity(req.headers)}`, 60)) return res.status(429).json({ error: 'Muitas consultas em sequência. Aguarde um instante.' });

  // extract CNPJ from query (Vercel automatic routing matches [cnpj])
  const { cnpj } = req.query;

  if (!cnpj || typeof cnpj !== 'string') {
    return res.status(400).json({ error: 'CNPJ não informado ou formato inválido.' });
  }

  // Clean the CNPJ parameter
  const cnpjLimpo = cnpj.replace(/\D/g, '');

  if (cnpjLimpo.length !== 14) {
    return res.status(400).json({
      error: `Formato de CNPJ inválido. Foram enviados ${cnpjLimpo.length} dígitos, mas o CNPJ deve conter exatamente 14 números.`,
    });
  }

  const publicApiUrl = `https://publica.cnpj.ws/cnpj/${cnpjLimpo}`;

  try {
    const apiResponse = await withProviderGuard(() => fetch(publicApiUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(12_000),
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CNPJ-Lookup-Dashboard',
      },
    }));

    if (apiResponse.status === 404) {
      return res.status(404).json({ error: 'CNPJ não encontrado na base de dados.' });
    }

    if (apiResponse.status === 429) {
      return res.status(429).json({
        error: 'Muitas consultas realizadas ao serviço de CNPJ. Por favor, tente novamente em alguns instantes.',
      });
    }

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({
        error: `Erro ao buscar dados na API externa. Código de status: ${apiResponse.status}`,
      });
    }

    const data = await apiResponse.json();
    return res.status(200).json(data);

  } catch (error: any) {
    console.error('CNPJ_PROVIDER_ERROR', error instanceof Error ? error.name : 'UnknownError');
    return res.status(500).json({
      error: 'Não foi possível realizar a consulta agora.',
    });
  }
}
