import type { CompanyFilters, CompanySearchResponse, CompanySummary } from '../types/companySearch';

const MAX_QUERY_LENGTH = 120;

function safeQuery(value: string): string {
  return value.trim().replace(/[<>\u0000-\u001F]/g, '').slice(0, MAX_QUERY_LENGTH);
}

function appendFilters(params: URLSearchParams, filters: CompanyFilters) {
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, String(value).slice(0, 80));
  });
}

async function request<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Não foi possível realizar a busca agora.');
  return payload as T;
}

export function getAutocompleteSuggestions(query: string, signal?: AbortSignal) {
  const params = new URLSearchParams({ q: safeQuery(query) });
  return request<{ data: CompanySummary[] }>(`/api/search/suggestions?${params}`, signal);
}

export function searchCompanies(query: string, filters: CompanyFilters, page = 1, signal?: AbortSignal) {
  const params = new URLSearchParams({ q: safeQuery(query), page: String(page) });
  appendFilters(params, filters);
  return request<CompanySearchResponse>(`/api/search?${params}`, signal);
}
