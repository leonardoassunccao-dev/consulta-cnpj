import type { CompanyFilters, CompanySearchResponse, CompanySummary } from '../../src/types/companySearch.js';
import { withProviderGuard } from './providerGuard.js';

export const SEARCH_MAX_RESULTS = 20;
export const SUGGESTION_MAX_RESULTS = 8;

const fallbackCompanies: CompanySummary[] = [
  { cnpj: '47960950000121', razaoSocial: 'MAGAZINE LUIZA S/A', nomeFantasia: 'MAGAZINE LUIZA', status: 'ATIVA', city: 'Franca', uf: 'SP', porte: 'DEMAIS', matrizFilial: 'MATRIZ', cnaePrincipal: 'Comércio varejista', dataAbertura: '1966-10-25', capitalSocial: 13800000000 },
  { cnpj: '19542775000100', razaoSocial: 'MAGALU LOGISTICA LTDA', nomeFantasia: 'MAGALU LOGISTICA', status: 'ATIVA', city: 'Louveira', uf: 'SP', porte: 'DEMAIS', matrizFilial: 'MATRIZ', cnaePrincipal: 'Transporte rodoviário' },
  { cnpj: '19210785000155', razaoSocial: 'TE LOG LOGISTICA LTDA', status: 'ATIVA', city: 'Sertãozinho', uf: 'SP', porte: 'DEMAIS', matrizFilial: 'MATRIZ', cnaePrincipal: 'Transporte rodoviário de carga', dataAbertura: '2013-11-06', capitalSocial: 1000000 },
  { cnpj: '33000167000101', razaoSocial: 'PETROLEO BRASILEIRO S A PETROBRAS', nomeFantasia: 'PETROBRAS', status: 'ATIVA', city: 'Rio de Janeiro', uf: 'RJ', porte: 'DEMAIS', matrizFilial: 'MATRIZ', cnaePrincipal: 'Extração de petróleo e gás natural' },
];

export function sanitizeSearchTerm(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>\u0000-\u001F]/g, '').slice(0, 120);
}

function normalize(value: string | undefined) {
  return (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function applyFallbackFilters(items: CompanySummary[], query: string, filters: CompanyFilters) {
  const term = normalize(query);
  return items.filter((item) => {
    const haystack = normalize(`${item.razaoSocial} ${item.nomeFantasia || ''} ${item.cnpj} ${item.cnaePrincipal || ''}`);
    if (term && !haystack.includes(term)) return false;
    if (filters.uf && item.uf !== filters.uf.toUpperCase()) return false;
    if (filters.city && !normalize(item.city).includes(normalize(filters.city))) return false;
    if (filters.status && item.status !== filters.status.toUpperCase()) return false;
    if (filters.porte && normalize(item.porte) !== normalize(filters.porte)) return false;
    if (filters.branchType && item.matrizFilial !== filters.branchType.toUpperCase()) return false;
    if (filters.cnae && !normalize(item.cnaePrincipal).includes(normalize(filters.cnae))) return false;
    const capital = item.capitalSocial || 0;
    if (filters.capitalMin && capital < Number(filters.capitalMin)) return false;
    if (filters.capitalMax && capital > Number(filters.capitalMax)) return false;
    if (filters.openedFrom && item.dataAbertura && item.dataAbertura < filters.openedFrom) return false;
    if (filters.openedTo && item.dataAbertura && item.dataAbertura > filters.openedTo) return false;
    return true;
  });
}

export async function searchCompanyDirectory(query: string, filters: CompanyFilters, page = 1): Promise<CompanySearchResponse> {
  const token = process.env.CNPJ_WS_API_TOKEN;
  const safePage = Math.max(1, Math.min(Number.isFinite(page) ? page : 1, 100));

  if (token) {
    const params = new URLSearchParams({ limite: String(SEARCH_MAX_RESULTS) });
    if (query) params.set('razao_social', query);
    if (filters.status) params.set('situacao_cadastral', filters.status);
    if (filters.cnae) params.set('atividade_principal_id', filters.cnae);
    if (filters.openedFrom) params.set('data_inicio_atividade_de', filters.openedFrom);
    if (filters.openedTo) params.set('data_inicio_atividade_ate', filters.openedTo);
    const response = await withProviderGuard(() => fetch(`https://comercial.cnpj.ws/v2/pesquisa?${params}`, { headers: { Accept: 'application/json', 'x_api_token': token }, signal: AbortSignal.timeout(12000) }));
    if (!response.ok) throw new Error('SEARCH_PROVIDER_UNAVAILABLE');
    const raw = await response.json();
    const data: CompanySummary[] = Array.isArray(raw.data) ? raw.data.map((item: any) => ({
      cnpj: String(item.cnpj || item.estabelecimento?.cnpj || ''),
      razaoSocial: item.razao_social || 'Razão social não informada',
      nomeFantasia: item.nome_fantasia || item.estabelecimento?.nome_fantasia,
      status: String(item.situacao_cadastral || item.estabelecimento?.situacao_cadastral || 'OUTRA').toUpperCase(),
      city: item.municipio || item.estabelecimento?.cidade?.nome,
      uf: item.uf || item.estabelecimento?.estado?.sigla,
    })) : [];
    return { data: data.slice(0, SEARCH_MAX_RESULTS), page: safePage, pageSize: SEARCH_MAX_RESULTS, hasMore: Boolean(raw.tem_proxima_pagina), source: 'commercial' };
  }

  const filtered = applyFallbackFilters(fallbackCompanies, query, filters);
  const start = (safePage - 1) * SEARCH_MAX_RESULTS;
  return { data: filtered.slice(start, start + SEARCH_MAX_RESULTS), page: safePage, pageSize: SEARCH_MAX_RESULTS, hasMore: filtered.length > start + SEARCH_MAX_RESULTS, source: 'fallback', notice: 'Busca textual em modo demonstrativo. Configure CNPJ_WS_API_TOKEN no servidor para consultar a base comercial completa.' };
}
