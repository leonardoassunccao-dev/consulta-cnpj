import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { allowRequest, requestIdentity } from './api/_lib/rateLimit';
import { withProviderGuard } from './api/_lib/providerGuard';
import { normalizeBrasilApi } from './api/_lib/cnpjNormalizer';
import { readJsonWithStreamLimit, validateAndSanitizeCnpjData } from './api/_lib/cnpjSchema';

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

const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Security: By default trust loopback/local proxies. If running behind a cloud proxy (e.g. AWS ALB, Cloud Run), configure TRUST_PROXY=1 in env.
  const trustProxySetting = process.env.TRUST_PROXY
    ? (process.env.TRUST_PROXY === 'true' ? 1 : process.env.TRUST_PROXY === 'false' ? false : process.env.TRUST_PROXY)
    : 'loopback';
  app.set('trust proxy', trustProxySetting);
  app.disable('x-powered-by');

  // Enforce body limit to prevent memory exhaustion DoS
  app.use(express.json({ limit: '10kb' }));

  // Global enterprise security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    res.setHeader('Content-Security-Policy', CSP);

    // Apply HSTS when served via HTTPS (avoids breaking local HTTP development)
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    if (isHttps) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // 1. CNPJ Serverless-like API Endpoint
  app.all('/api/cnpj/:cnpj', async (req, res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

    if (req.method === 'OPTIONS') {
      res.setHeader('Allow', 'GET, HEAD, OPTIONS');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(204).end();
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('Allow', 'GET, HEAD, OPTIONS');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      return res.status(405).json({ error: 'Método não permitido. Use GET ou HEAD.', code: 'METHOD_NOT_ALLOWED' });
    }

    const clientIdentity = requestIdentity(req.headers, req.ip);
    if (!allowRequest(`company:${clientIdentity}`, 60)) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Retry-After', '60');
      return res.status(429).json({ error: 'Muitas consultas em sequência. Aguarde um instante.', code: 'RATE_LIMITED' });
    }

    const { cnpj } = req.params;

    if (!cnpj) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      return res.status(400).json({ error: 'CNPJ não informado.', code: 'INVALID_PARAM' });
    }

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

    // Cache successful responses only (30 minutes)
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
    if (req.method === 'HEAD') {
      return res.status(200).end();
    }
    return res.json(result.data);
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
