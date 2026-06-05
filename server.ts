import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Let Express parse JSON bodies if needed
  app.use(express.json());

  // 1. CNPJ Serverless-like API Endpoint
  app.get('/api/cnpj/:cnpj', async (req, res) => {
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
      console.log(`[CNPJ Server Check] Buscando CNPJ ${cnpjLimpo} na API externa...`);
      const apiResponse = await fetch(publicApiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CNPJ-Lookup-Dashboard',
        },
      });

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
      console.error('[CNPJ Server Error]:', error);
      return res.status(500).json({
        error: 'Erro interno no servidor ao consultar o CNPJ. Detalhes: ' + (error.message || String(error)),
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
