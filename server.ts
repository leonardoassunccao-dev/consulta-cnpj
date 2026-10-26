import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { allowRequest } from './api/_lib/rateLimit';
import { withProviderGuard } from './api/_lib/providerGuard';

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

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

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

  // 1. CNPJ Serverless-like API Endpoint
  app.get('/api/cnpj/:cnpj', async (req, res) => {
    if (!allowRequest(`company:${req.ip}`, 60)) return res.status(429).json({ error: 'Muitas consultas em sequência. Aguarde um instante.' });
    const { cnpj } = req.params;

    if (!cnpj) {
      return res.status(400).json({ error: 'CNPJ não informado.' });
    }

    const cnpjLimpo = cnpj.replace(/\D/g, '');

    if (!validCnpj(cnpjLimpo)) {
      return res.status(400).json({
        error: 'Digite um CNPJ válido.',
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
