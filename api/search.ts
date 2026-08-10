import type { ApiRequest, ApiResponse } from './_lib/httpTypes.js';
import { sanitizeSearchTerm, searchCompanyDirectory } from './_lib/companySearch.js';
import { allowRequest, requestIdentity } from './_lib/rateLimit.js';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido.' });
  if (!allowRequest(`search:${requestIdentity(req.headers)}`, 30)) return res.status(429).json({ error: 'Muitas buscas em sequência. Aguarde um instante.' });
  const q = sanitizeSearchTerm(req.query.q);
  const filters = { uf: sanitizeSearchTerm(req.query.uf), city: sanitizeSearchTerm(req.query.city), status: sanitizeSearchTerm(req.query.status), porte: sanitizeSearchTerm(req.query.porte), branchType: sanitizeSearchTerm(req.query.branchType), cnae: sanitizeSearchTerm(req.query.cnae), openedFrom: sanitizeSearchTerm(req.query.openedFrom), openedTo: sanitizeSearchTerm(req.query.openedTo), capitalMin: sanitizeSearchTerm(req.query.capitalMin), capitalMax: sanitizeSearchTerm(req.query.capitalMax) };
  if (!q && !Object.values(filters).some(Boolean)) return res.status(400).json({ error: 'Informe um termo ou ao menos um filtro.' });
  try { return res.status(200).json(await searchCompanyDirectory(q, filters, Number(req.query.page || 1))); }
  catch { return res.status(503).json({ error: 'Não foi possível realizar a busca agora. Tente novamente.' }); }
}
