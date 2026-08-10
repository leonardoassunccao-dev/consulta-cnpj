import type { ApiRequest, ApiResponse } from '../_lib/httpTypes';
import { sanitizeSearchTerm, searchCompanyDirectory, SUGGESTION_MAX_RESULTS } from '../_lib/companySearch';
import { allowRequest, requestIdentity } from '../_lib/rateLimit';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido.' });
  if (!allowRequest(`suggestions:${requestIdentity(req.headers)}`, 100)) return res.status(429).json({ error: 'Muitas solicitações.' });
  const q = sanitizeSearchTerm(req.query.q);
  if (q.length < 3) return res.status(200).json({ data: [] });
  try { const result = await searchCompanyDirectory(q, {}, 1); return res.status(200).json({ data: result.data.slice(0, SUGGESTION_MAX_RESULTS), source: result.source }); }
  catch { return res.status(200).json({ data: [] }); }
}
