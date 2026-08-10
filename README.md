<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# CNPJ Premium

Busca e exploração de empresas brasileiras com consulta direta por CNPJ, pesquisa textual, autocomplete e filtros avançados.

View your app in AI Studio: https://ai.studio/apps/3272b2c2-474d-4bbd-ac6c-4abaa9c1391a

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Opcionalmente, configure `CNPJ_WS_API_TOKEN` apenas no servidor para habilitar a busca comercial completa. Sem esse token, a busca textual usa um catálogo demonstrativo e a consulta por CNPJ continua usando a API pública.
3. Run the app:
   `npm run dev`

## Arquitetura de busca

- `src/services/companySearch.ts`: contrato independente de provedor usado pela interface.
- `api/search.ts`: pesquisa textual e filtros, até 20 resultados por página.
- `api/search/suggestions.ts`: autocomplete com no máximo 8 resultados.
- `api/cnpj/[cnpj].ts`: consulta legada compatível por CNPJ.
- `api/_lib/companySearch.ts`: adaptador da API comercial e fallback demonstrativo.

O frontend aplica debounce de 300 ms, cancela requisições obsoletas com `AbortController` e nunca solicita o registro completo para montar sugestões. As rotas validam tamanho, removem caracteres de controle, limitam paginação e aplicam rate limiting básico por instância.

## Próxima etapa de dados

Para receber a base completa da Receita Federal, implemente um novo adaptador do serviço para PostgreSQL, com campos normalizados, paginação por cursor e índices `pg_trgm` para razão social e nome fantasia. Não use buscas `%termo%` sem índice em uma tabela integral. Nenhuma migration ou importação massiva é executada por este projeto.

## Verificação

```text
npm run typecheck
npm test
npm run build
```
