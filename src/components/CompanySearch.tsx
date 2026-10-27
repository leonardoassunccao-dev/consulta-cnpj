import React, { FormEvent, useState, ClipboardEvent } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { formatCnpjInput, isValidCnpj, normalizeCnpj } from '../utils/cnpj';

interface Props {
  onCnpjSearch: (cnpj: string) => Promise<boolean>;
  onClear: () => void;
  isLoading: boolean;
  hasCompany: boolean;
  onAttentionChange?: (attention: 'cursor' | 'input' | 'button') => void;
}

export default function CompanySearch({
  onCnpjSearch,
  onClear,
  isLoading,
  hasCompany,
  onAttentionChange,
}: Props) {
  const [cnpj, setCnpj] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event?: FormEvent) {
    if (event) event.preventDefault();
    if (isLoading) return;

    const normalized = normalizeCnpj(cnpj);

    if (!normalized || normalized.length === 0) {
      setError('Digite o CNPJ da empresa.');
      return;
    }

    if (!isValidCnpj(normalized)) {
      setError('CNPJ inválido. Verifique os 14 dígitos e tente novamente.');
      return;
    }

    setError(null);
    await onCnpjSearch(normalized);
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText) return;

    const formatted = formatCnpjInput(pastedText);
    setCnpj(formatted);
    if (error) setError(null);
  }

  function clearAll() {
    setCnpj('');
    setError(null);
    onClear();
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-3">
      <form onSubmit={handleSubmit} className="relative" role="search" noValidate>
        {/* Arik Minimalist Luxury Console */}
        <div
          className={`relative flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-[#141415] border transition-all duration-300 shadow-[0_16px_40px_rgba(0,0,0,0.5)] ${
            error
              ? 'border-red-900/80 ring-1 ring-red-900/30'
              : 'border-[#2d2b28] hover:border-[#dac5a7]/40 focus-within:border-[#dac5a7] focus-within:ring-2 focus-within:ring-[#dac5a7]/20'
          }`}
        >
          {/* Discrete Search Icon */}
          <div className="pl-3.5 text-[#9e9b97] flex items-center">
            <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
          </div>

          {/* Accessible Hidden Label */}
          <label htmlFor="cnpj-search-input" className="sr-only">
            Digite o CNPJ da empresa para consulta cadastral
          </label>

          {/* Input field */}
          <input
            id="cnpj-search-input"
            type="text"
            value={cnpj}
            aria-label="Digite o CNPJ da empresa para consulta cadastral"
            onChange={(e) => {
              const formatted = formatCnpjInput(e.target.value);
              setCnpj(formatted);
              if (error) setError(null);
            }}
            onPaste={handlePaste}
            placeholder="Digite o CNPJ da empresa"
            autoComplete="off"
            inputMode="numeric"
            disabled={isLoading}
            onFocus={() => onAttentionChange?.('input')}
            onBlur={() => onAttentionChange?.('cursor')}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'cnpj-input-error' : undefined}
            className="flex-1 min-w-0 bg-transparent py-2.5 px-2 text-sm sm:text-base font-mono text-[#f5f3ef] placeholder:text-[#6a6660] focus:outline-none tracking-wide disabled:text-[#6a6660]"
          />

          {/* Clear button if text entered */}
          {(cnpj || hasCompany) && (
            <button
              type="button"
              onClick={clearAll}
              disabled={isLoading}
              aria-label="Limpar consulta"
              className="p-2 text-[#9e9b97] hover:text-white transition rounded-xl hover:bg-white/[0.05] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Action Button: Consultar (Solid Champagne Arik Button) */}
          <button
            type="submit"
            disabled={isLoading}
            onPointerEnter={() => onAttentionChange?.('button')}
            onPointerLeave={() => onAttentionChange?.('cursor')}
            onFocus={() => onAttentionChange?.('button')}
            onBlur={() => onAttentionChange?.('cursor')}
            className="h-10 sm:h-11 px-6 rounded-xl bg-[#dac5a7] text-[#0c0c0d] font-sans font-bold text-xs sm:text-sm hover:bg-[#edd6b6] transition duration-200 flex items-center justify-center gap-2 select-none active:scale-[0.98] cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0c0c0d]" />
                <span>Consultando…</span>
              </>
            ) : (
              <span>Consultar</span>
            )}
          </button>
        </div>
      </form>

      {/* Accessible Error Banner */}
      {error && (
        <div
          id="cnpj-input-error"
          role="alert"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-950/30 border border-red-900/40 text-xs font-mono text-red-300 animate-fade-in"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
