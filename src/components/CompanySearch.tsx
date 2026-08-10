import React, { FormEvent, useEffect, useId, useRef, useState } from 'react';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { getAutocompleteSuggestions, searchCompanies } from '../services/companySearch';
import type { CompanyFilters, CompanySearchResponse, CompanySummary } from '../types/companySearch';
import { detectSearchKind, normalizeCnpj } from '../utils/cnpj';
import { formatCNPJ } from '../utils/formatters';

interface Props { onCnpjSearch: (cnpj: string) => Promise<boolean>; onClear: () => void; isLoading: boolean; hasCompany: boolean; }
const emptyFilters: CompanyFilters = {};

export default function CompanySearch({ onCnpjSearch, onClear, isLoading, hasCompany }: Props) {
  const listboxId = useId();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CompanySummary[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<CompanyFilters>(emptyFilters);
  const [filters, setFilters] = useState<CompanyFilters>(emptyFilters);
  const [result, setResult] = useState<CompanySearchResponse | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suggestionRequest = useRef<AbortController | null>(null);
  const searchRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!inputFocused || detectSearchKind(query) !== 'text' || query.trim().length < 3) { suggestionRequest.current?.abort(); setSuggestions([]); return; }
    const timer = window.setTimeout(async () => {
      suggestionRequest.current?.abort();
      const controller = new AbortController();
      suggestionRequest.current = controller;
      try { const response = await getAutocompleteSuggestions(query, controller.signal); setSuggestions(response.data.slice(0, 8)); setActiveSuggestion(-1); }
      catch (requestError) { if ((requestError as Error).name !== 'AbortError') setSuggestions([]); }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [inputFocused, query]);

  useEffect(() => () => { suggestionRequest.current?.abort(); searchRequest.current?.abort(); }, []);

  async function runSearch(page = 1, activeFilters = filters) {
    const kind = detectSearchKind(query);
    if (kind === 'empty' && !Object.values(activeFilters).some(Boolean)) { setError('Digite um CNPJ, empresa ou nome fantasia.'); return; }
    setSuggestions([]); setError(null);
    if (kind === 'cnpj') {
      const normalized = normalizeCnpj(query);
      if (!/^\d{14}$/.test(normalized)) { setError('O CNPJ alfanumérico já é aceito, mas o provedor público atual ainda não oferece consulta para esse formato.'); return; }
      await onCnpjSearch(normalized); return;
    }
    onClear();
    searchRequest.current?.abort();
    const controller = new AbortController(); searchRequest.current = controller; setSearching(true);
    try { setResult(await searchCompanies(query, activeFilters, page, controller.signal)); }
    catch (requestError) { if ((requestError as Error).name !== 'AbortError') setError((requestError as Error).message); }
    finally { if (!controller.signal.aborted) setSearching(false); }
  }

  function selectCompany(company: CompanySummary) { setInputFocused(false); setQuery(company.nomeFantasia || company.razaoSocial); setSuggestions([]); setResult(null); void onCnpjSearch(company.cnpj); }
  function clearAll() { suggestionRequest.current?.abort(); searchRequest.current?.abort(); setQuery(''); setSuggestions([]); setResult(null); setError(null); setDraftFilters(emptyFilters); setFilters(emptyFilters); onClear(); }
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); setActiveSuggestion((current) => (current + 1) % suggestions.length); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActiveSuggestion((current) => (current <= 0 ? suggestions.length - 1 : current - 1)); }
    if (event.key === 'Escape') { setSuggestions([]); setActiveSuggestion(-1); }
    if (event.key === 'Enter' && activeSuggestion >= 0) { event.preventDefault(); selectCompany(suggestions[activeSuggestion]); }
  }

  const busy = isLoading || searching;
  const filterCount = Object.values(filters).filter(Boolean).length;
  return <div className="mx-auto w-full max-w-4xl space-y-4">
    <form onSubmit={(event: FormEvent) => { event.preventDefault(); void runSearch(); }} className="relative" role="search">
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/75 p-3 shadow-[0_24px_80px_rgba(0,0,0,.55)] focus-within:border-zinc-600 md:flex-row">
        <label className="flex min-w-0 flex-1 items-center gap-3 px-2"><Search aria-hidden="true" className="h-5 w-5 shrink-0 text-zinc-500" /><span className="sr-only">Buscar empresa</span>
          <input value={query} onChange={(event) => setQuery(event.target.value.slice(0, 120))} onFocus={() => setInputFocused(true)} onBlur={() => window.setTimeout(() => setInputFocused(false), 100)} onKeyDown={handleKeyDown} placeholder="CNPJ, empresa ou nome fantasia..." autoComplete="off" disabled={busy} aria-expanded={suggestions.length > 0} aria-controls={listboxId} aria-autocomplete="list" className="w-full bg-transparent py-3 text-base text-white outline-none placeholder:text-zinc-600 md:text-lg" />
        </label>
        <div className="flex gap-2">
          {(query || result || hasCompany) ? <button type="button" onClick={clearAll} className="rounded-xl border border-zinc-800 px-3 text-zinc-400 hover:text-white" aria-label="Limpar busca"><X className="h-4 w-4" /></button> : null}
          <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-3 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"><SlidersHorizontal className="h-4 w-4" /> Filtros {filterCount ? `(${filterCount})` : ''}</button>
          <button type="submit" disabled={busy} className="min-w-28 rounded-xl bg-white px-5 py-3 text-sm font-bold text-zinc-950 disabled:opacity-50">{busy ? 'Buscando…' : 'Buscar'}</button>
        </div>
      </div>
      {suggestions.length ? <ul id={listboxId} role="listbox" className="absolute z-40 mt-2 max-h-96 w-full overflow-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
        {suggestions.map((company, index) => <li key={company.cnpj} role="option" aria-selected={activeSuggestion === index} onMouseDown={(event) => event.preventDefault()} onClick={() => selectCompany(company)} className={`cursor-pointer rounded-xl px-4 py-3 ${activeSuggestion === index ? 'bg-zinc-800' : 'hover:bg-zinc-900'}`}>
          <div className="flex items-start justify-between gap-4"><div><p className="font-semibold text-white">{company.nomeFantasia || company.razaoSocial}</p>{company.nomeFantasia ? <p className="text-xs text-zinc-500">{company.razaoSocial}</p> : null}</div><span className="text-[10px] font-semibold text-emerald-400">{company.status}</span></div>
          <p className="mt-1 text-xs text-zinc-500">{formatCNPJ(company.cnpj)} · {company.city || 'Cidade não informada'} • {company.uf || 'UF'}</p>
        </li>)}
      </ul> : null}
    </form>
    {filtersOpen ? <FilterPanel value={draftFilters} onChange={setDraftFilters} onApply={() => { setFilters(draftFilters); setFiltersOpen(false); void runSearch(1, draftFilters); }} onClear={() => { setDraftFilters(emptyFilters); setFilters(emptyFilters); }} /> : null}
    {error ? <p role="alert" className="rounded-xl border border-red-950 bg-red-950/20 px-4 py-3 text-sm text-red-300">{error}</p> : null}
    {searching ? <div className="space-y-3" aria-label="Carregando resultados">{[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-xl bg-zinc-900" />)}</div> : null}
    {!searching && result ? <SearchResults result={result} onSelect={selectCompany} onPage={(page) => void runSearch(page)} /> : null}
  </div>;
}

function FilterPanel({ value, onChange, onApply, onClear }: { value: CompanyFilters; onChange: (value: CompanyFilters) => void; onApply: () => void; onClear: () => void }) {
  const field = (key: keyof CompanyFilters, next: string) => onChange({ ...value, [key]: next });
  return <section aria-label="Filtros avançados" className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 md:p-6"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <FilterInput label="UF" value={value.uf} onChange={(next) => field('uf', next.toUpperCase().slice(0, 2))} placeholder="SP" /><FilterInput label="Município" value={value.city} onChange={(next) => field('city', next)} placeholder="Ribeirão Preto" />
    <label className="space-y-1 text-xs text-zinc-400">Situação<select value={value.status || ''} onChange={(event) => field('status', event.target.value)} className="filter-field"><option value="">Todas</option><option>ATIVA</option><option>SUSPENSA</option><option>INAPTA</option><option>BAIXADA</option></select></label>
    <label className="space-y-1 text-xs text-zinc-400">Tipo<select value={value.branchType || ''} onChange={(event) => field('branchType', event.target.value)} className="filter-field"><option value="">Matriz e filial</option><option>MATRIZ</option><option>FILIAL</option></select></label>
    <FilterInput label="Porte" value={value.porte} onChange={(next) => field('porte', next)} placeholder="Demais" /><FilterInput label="CNAE principal" value={value.cnae} onChange={(next) => field('cnae', next)} placeholder="Transporte" />
    <FilterInput label="Abertura inicial" type="date" value={value.openedFrom} onChange={(next) => field('openedFrom', next)} /><FilterInput label="Abertura final" type="date" value={value.openedTo} onChange={(next) => field('openedTo', next)} />
    <FilterInput label="Capital mínimo" type="number" value={value.capitalMin} onChange={(next) => field('capitalMin', next)} placeholder="0" /><FilterInput label="Capital máximo" type="number" value={value.capitalMax} onChange={(next) => field('capitalMax', next)} placeholder="1000000" />
  </div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClear} className="rounded-lg px-4 py-2 text-xs text-zinc-400">Limpar filtros</button><button type="button" onClick={onApply} className="rounded-lg bg-white px-5 py-2 text-xs font-bold text-zinc-950">Aplicar filtros</button></div></section>;
}

function FilterInput({ label, value, onChange, placeholder, type = 'text' }: { label: string; value?: string; onChange: (value: string) => void; placeholder?: string; type?: string }) { return <label className="space-y-1 text-xs text-zinc-400">{label}<input type={type} value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="filter-field" /></label>; }

function SearchResults({ result, onSelect, onPage }: { result: CompanySearchResponse; onSelect: (company: CompanySummary) => void; onPage: (page: number) => void }) {
  return <section aria-live="polite" className="space-y-4 pt-4"><div className="flex items-end justify-between"><div><p className="text-[10px] uppercase tracking-[.2em] text-zinc-500">Resultados</p><h2 className="text-xl font-bold text-white">Empresas encontradas</h2></div><span className="text-xs text-zinc-500">Página {result.page}</span></div>
    {result.notice ? <p className="rounded-lg border border-amber-900/40 bg-amber-950/20 px-3 py-2 text-xs text-amber-300">{result.notice}</p> : null}
    {!result.data.length ? <p className="rounded-xl border border-zinc-800 p-8 text-center text-zinc-400">Nenhuma empresa encontrada para os critérios informados.</p> : result.data.map((company) => <button key={company.cnpj} type="button" onClick={() => onSelect(company)} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 text-left transition hover:border-zinc-700 hover:bg-zinc-900/70"><div className="flex flex-col justify-between gap-2 sm:flex-row"><div><h3 className="font-semibold text-white">{company.nomeFantasia || company.razaoSocial}</h3>{company.nomeFantasia ? <p className="text-xs text-zinc-500">{company.razaoSocial}</p> : null}<p className="mt-2 text-xs text-zinc-400">{formatCNPJ(company.cnpj)} · {company.city || 'Cidade não informada'} • {company.uf || 'UF'}</p></div><span className="self-start rounded-full border border-emerald-900/50 bg-emerald-950/40 px-2 py-1 text-[10px] font-bold text-emerald-400">{company.status}</span></div></button>)}
    <div className="flex justify-end gap-2"><button disabled={result.page <= 1} onClick={() => onPage(result.page - 1)} className="rounded-lg border border-zinc-800 px-3 py-2 text-xs disabled:opacity-30">Anterior</button><button disabled={!result.hasMore} onClick={() => onPage(result.page + 1)} className="rounded-lg border border-zinc-800 px-3 py-2 text-xs disabled:opacity-30">Próxima</button></div>
  </section>;
}
