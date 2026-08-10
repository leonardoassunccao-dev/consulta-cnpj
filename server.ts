import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { sanitizeSearchTerm, searchCompanyDirectory } from './api/_lib/companySearch';
import { allowRequest } from './api/_lib/rateLimit';
import { withProviderGuard } from './api/_lib/providerGuard';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Let Express parse JSON bodies if needed
  app.use(express.json());
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  });

  app.get('/api/search', async (req, res) => {
    if (!allowRequest(`search:${req.ip}`, 30)) return res.status(429).json({ error: 'Muitas buscas em sequência. Aguarde um instante.' });
    const q = sanitizeSearchTerm(req.query.q);
    const filters = {
      uf: sanitizeSearchTerm(req.query.uf), city: sanitizeSearchTerm(req.query.city), status: sanitizeSearchTerm(req.query.status),
      porte: sanitizeSearchTerm(req.query.porte), branchType: sanitizeSearchTerm(req.query.branchType), cnae: sanitizeSearchTerm(req.query.cnae),
      openedFrom: sanitizeSearchTerm(req.query.openedFrom), openedTo: sanitizeSearchTerm(req.query.openedTo),
      capitalMin: sanitizeSearchTerm(req.query.capitalMin), capitalMax: sanitizeSearchTerm(req.query.capitalMax),
    };
    if (!q && !Object.values(filters).some(Boolean)) return res.status(400).json({ error: 'Informe um termo ou ao menos um filtro.' });
    try { return res.json(await searchCompanyDirectory(q, filters, Number(req.query.page || 1))); }
    catch { return res.status(503).json({ error: 'Não foi possível realizar a busca agora. Tente novamente.' }); }
  });

  app.get('/api/search/suggestions', async (req, res) => {
    if (!allowRequest(`suggestions:${req.ip}`, 30)) return res.status(429).json({ error: 'Muitas solicitações.' });
    const q = sanitizeSearchTerm(req.query.q);
    if (q.length < 3) return res.json({ data: [] });
    try { const result = await searchCompanyDirectory(q, {}, 1); return res.json({ data: result.data.slice(0, 8), source: result.source }); }
    catch { return res.json({ data: [] }); }
  });

  // 1. CNPJ Serverless-like API Endpoint
  app.get('/api/cnpj/:cnpj', async (req, res) => {
    if (!allowRequest(`company:${req.ip}`, 60)) return res.status(429).json({ error: 'Muitas consultas em sequência. Aguarde um instante.' });
    const { cnpj } = req.params;

    if (!cnpj) {
      return res.status(400).json({ error: 'CNPJ não informado.' });
    }

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
      return res.json(data);

    } catch (error: any) {
      console.error('[CNPJ Server Error]', error instanceof Error ? error.name : 'UnknownError');
      return res.status(500).json({
        error: 'Não foi possível realizar a consulta agora.',
      });
    }
  });

  // 2. Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Dev] Vite middleware loaded.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Prod] Static production assets loaded.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
