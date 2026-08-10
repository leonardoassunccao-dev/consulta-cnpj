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

function normalizeCompact(value: string | undefined) {
  return normalize(value).replace(/[^a-z0-9]/g, '');
}

function applyFallbackFilters(items: CompanySummary[], query: string, filters: CompanyFilters) {
  const term = normalize(query);
  const compactTerm = normalizeCompact(query);
  return items.filter((item) => {
    const haystack = normalize(`${item.razaoSocial} ${item.nomeFantasia || ''} ${item.cnpj} ${item.cnaePrincipal || ''}`);
    if (term && !haystack.includes(term) && !normalizeCompact(haystack).includes(compactTerm)) return false;
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

function mapProviderCompany(item: unknown, query: string): CompanySummary | null {
  if (typeof item === 'string') {
    return /^\d{14}$/.test(item) ? { cnpj: item, razaoSocial: query || 'Empresa encontrada', status: 'OUTRA' } : null;
  }
  if (!item || typeof item !== 'object') return null;
  const company = item as any;
  const cnpj = String(company.cnpj || company.estabelecimento?.cnpj || '');
  if (!/^\d{14}$/.test(cnpj)) return null;
  return {
    cnpj,
    razaoSocial: company.razao_social || query || 'Empresa encontrada',
    nomeFantasia: company.nome_fantasia || company.estabelecimento?.nome_fantasia,
    status: String(company.situacao_cadastral || company.estabelecimento?.situacao_cadastral || 'OUTRA').toUpperCase() as CompanySummary['status'],
    city: company.municipio || company.estabelecimento?.cidade?.nome,
    uf: company.uf || company.estabelecimento?.estado?.sigla,
  };
}

async function requestCommercialDirectory(params: URLSearchParams, token: string) {
  const response = await withProviderGuard(() => fetch(`https://comercial.cnpj.ws/v2/pesquisa?${params}`, {
    headers: { Accept: 'application/json', x_api_token: token },
    signal: AbortSignal.timeout(12_000),
  }));
  if (!response.ok) throw new Error('SEARCH_PROVIDER_UNAVAILABLE');
  return response.json();
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
    let raw = await requestCommercialDirectory(params, token);
    if (query && (!Array.isArray(raw.data) || raw.data.length === 0)) {
      params.delete('razao_social');
      params.set('nome_fantasia', query);
      raw = await requestCommercialDirectory(params, token);
    }
    const data: CompanySummary[] = Array.isArray(raw.data)
      ? raw.data.map((item: unknown) => mapProviderCompany(item, query)).filter((item: CompanySummary | null): item is CompanySummary => item !== null)
      : [];
    return { data: data.slice(0, SEARCH_MAX_RESULTS), page: safePage, pageSize: SEARCH_MAX_RESULTS, hasMore: false, source: 'commercial' };
  }

  const filtered = applyFallbackFilters(fallbackCompanies, query, filters);
  const start = (safePage - 1) * SEARCH_MAX_RESULTS;
  return {
    data: filtered.slice(start, start + SEARCH_MAX_RESULTS),
    page: safePage,
    pageSize: SEARCH_MAX_RESULTS,
    hasMore: filtered.length > start + SEARCH_MAX_RESULTS,
    source: 'fallback',
    notice: filtered.length ? undefined : 'Não foi possível realizar a busca por nome neste momento. A consulta por CNPJ continua disponível.',
  };
}
