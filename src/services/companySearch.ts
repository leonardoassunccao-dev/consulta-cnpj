import type { CompanyFilters, CompanySearchResponse, CompanySummary } from '../types/companySearch';

const MAX_QUERY_LENGTH = 120;
const SUGGESTION_CACHE_TTL_MS = 60_000;
const suggestionCache = new Map<string, { expiresAt: number; data: CompanySummary[] }>();

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

export async function getAutocompleteSuggestions(query: string, signal?: AbortSignal) {
  const normalizedQuery = safeQuery(query).toLocaleLowerCase('pt-BR');
  const cached = suggestionCache.get(normalizedQuery);
  if (cached && cached.expiresAt > Date.now()) return { data: cached.data };
  if (cached) suggestionCache.delete(normalizedQuery);
  const params = new URLSearchParams({ q: normalizedQuery });
  const response = await request<{ data: CompanySummary[] }>(`/api/search/suggestions?${params}`, signal);
  suggestionCache.set(normalizedQuery, { expiresAt: Date.now() + SUGGESTION_CACHE_TTL_MS, data: response.data });
  if (suggestionCache.size > 50) suggestionCache.delete(suggestionCache.keys().next().value as string);
  return response;
}

export function searchCompanies(query: string, filters: CompanyFilters, page = 1, signal?: AbortSignal) {
  const params = new URLSearchParams({ q: safeQuery(query), page: String(page) });
  appendFilters(params, filters);
  return request<CompanySearchResponse>(`/api/search?${params}`, signal);
}
