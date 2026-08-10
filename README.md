<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# CNPJ Premium

Consulta e exploração de dados cadastrais de empresas brasileiras pelo CNPJ.

View your app in AI Studio: https://ai.studio/apps/3272b2c2-474d-4bbd-ac6c-4abaa9c1391a

## Executar localmente

**Pré-requisito:** Node.js

1. Instale as dependências: `npm install`
2. Inicie o projeto: `npm run dev`

## Arquitetura da consulta

- `src/components/CompanySearch.tsx`: entrada e validação do CNPJ.
- `src/services/cnpjApi.ts`: cliente da rota interna com timeout e tratamento de erros.
- `api/cnpj/[cnpj].ts`: consulta server-side à API pública CNPJ.ws.
- `api/_lib/rateLimit.ts`: proteção básica contra abuso.

A consulta externa ocorre exclusivamente no backend. O frontend aceita CNPJ formatado ou apenas com dígitos e nunca recebe credenciais privadas.

## Verificação

```text
npm run lint
npm run typecheck
npm test
npm run build
```
