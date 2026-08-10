import React, { FormEvent, useState } from 'react';
import { Search, X } from 'lucide-react';
import { formatCnpjInput, isTraditionalCnpj, normalizeCnpj } from '../utils/cnpj';

interface Props {
  onCnpjSearch: (cnpj: string) => Promise<boolean>;
  onClear: () => void;
  isLoading: boolean;
  hasCompany: boolean;
}

export default function CompanySearch({ onCnpjSearch, onClear, isLoading, hasCompany }: Props) {
  const [cnpj, setCnpj] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const normalized = normalizeCnpj(cnpj);
    if (!isTraditionalCnpj(normalized)) {
      setError('Digite um CNPJ válido.');
      return;
    }
    setError(null);
    await onCnpjSearch(normalized);
  }

  function clearAll() {
    setCnpj('');
    setError(null);
    onClear();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-3">
      <form onSubmit={handleSubmit} className="relative" role="search" noValidate>
        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/75 p-3 shadow-[0_24px_80px_rgba(0,0,0,.55)] focus-within:border-zinc-600 sm:flex-row">
          <label className="flex min-w-0 flex-1 items-center gap-3 px-2">
            <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-zinc-500" />
            <span className="sr-only">Digite o CNPJ da empresa</span>
            <input
              value={cnpj}
              onChange={(event) => {
                setCnpj(formatCnpjInput(event.target.value));
                if (error) setError(null);
              }}
              placeholder="Digite o CNPJ da empresa"
              autoComplete="off"
              inputMode="numeric"
              disabled={isLoading}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'cnpj-input-error' : undefined}
              className="w-full bg-transparent py-3 text-base text-white outline-none placeholder:text-zinc-600 md:text-lg"
            />
          </label>
          <div className="flex gap-2">
            {(cnpj || hasCompany) ? (
              <button type="button" onClick={clearAll} className="rounded-xl border border-zinc-800 px-3 text-zinc-400 transition-colors hover:text-white" aria-label="Limpar consulta">
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            ) : null}
            <button type="submit" disabled={isLoading} className="min-w-28 flex-1 rounded-xl bg-white px-5 py-3 text-sm font-bold text-zinc-950 disabled:opacity-50 sm:flex-none">
              {isLoading ? 'Consultando…' : 'Consultar'}
            </button>
          </div>
        </div>
      </form>
      {error ? <p id="cnpj-input-error" role="alert" className="px-1 text-left text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
