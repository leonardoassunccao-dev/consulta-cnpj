import React, { FormEvent, useState, ClipboardEvent } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { formatCnpjInput, isValidCnpj, normalizeCnpj } from '../utils/cnpj';

interface Props {
  onCnpjSearch: (cnpj: string) => Promise<boolean>;
  onClear: () => void;
  isLoading: boolean;
  hasCompany: boolean;
  onAttentionChange?: (attention: 'cursor' | 'input' | 'button') => void;
}

const QUICK_SUGGESTIONS = [
  { name: 'Petrobras', cnpj: '33.000.167/0001-01', raw: '33000167000101', code: 'PETR4' },
  { name: 'Banco do Brasil', cnpj: '00.000.000/0001-91', raw: '00000000000191', code: 'BBAS3' },
  { name: 'Magazine Luiza', cnpj: '47.960.950/0001-21', raw: '47960950000121', code: 'MGLU3' },
  { name: 'TELOG Logística', cnpj: '19.210.785/0001-55', raw: '19210785000155', code: 'TELOG' },
];

export default function CompanySearch({
  onCnpjSearch,
  onClear,
  isLoading,
  hasCompany,
  onAttentionChange,
}: Props) {
  const [cnpj, setCnpj] = useState('');
  const [error, setError] = useState<string | null>(null);

  const cleanDigits = cnpj.replace(/\D/g, '');
  const isComplete = cleanDigits.length === 14;

  async function handleSubmit(event?: FormEvent) {
    if (event) event.preventDefault();
    if (isLoading) return;

    const normalized = normalizeCnpj(cnpj);

    if (!normalized || normalized.length === 0) {
      setError('Informe um CNPJ para realizar a consulta.');
      return;
    }

    if (!isValidCnpj(normalized)) {
      setError('CNPJ inválido no algoritmo Módulo 11 da Receita Federal. Verifique os dígitos informados.');
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

  function handleQuickSelect(suggestion: typeof QUICK_SUGGESTIONS[0]) {
    setCnpj(suggestion.cnpj);
    setError(null);
    void onCnpjSearch(suggestion.raw);
  }

  function clearAll() {
    setCnpj('');
    setError(null);
    onClear();
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3.5 text-left">
      <form onSubmit={handleSubmit} className="relative" role="search" noValidate>
        {/* Architectural Console Container */}
        <div
          className={`relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 sm:p-2.5 rounded-2xl bg-[#060608] border transition-all duration-200 shadow-[0_24px_70px_rgba(0,0,0,0.9)] ${
            error
              ? 'border-red-800/80 ring-1 ring-red-900/40'
              : 'border-white/[0.1] hover:border-white/[0.18] focus-within:border-marsala-500/80 focus-within:ring-1 focus-within:ring-marsala-500/30'
          }`}
        >
          {/* Technical Search Icon */}
          <div className="hidden sm:flex items-center pl-3.5 pr-1 text-zinc-500">
            <Search className="w-5 h-5 shrink-0" aria-hidden="true" />
          </div>

          {/* Formatted CNPJ Input */}
          <div className="flex-1 min-w-0 flex items-center px-2 sm:px-1">
            <span className="sr-only">Digite o CNPJ da empresa</span>
            <input
              type="text"
              value={cnpj}
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
              className="w-full bg-transparent py-3 text-base sm:text-lg md:text-xl font-mono text-white placeholder:text-zinc-650 focus:outline-none tracking-wider disabled:text-zinc-600 font-medium"
            />
          </div>

          {/* Controls: Clear button and High-Contrast Submit */}
          <div className="flex items-center gap-2 px-1">
            {(cnpj || hasCompany) && (
              <button
                type="button"
                onClick={clearAll}
                disabled={isLoading}
                aria-label="Limpar consulta"
                className="p-2.5 rounded-xl border border-white/[0.08] bg-zinc-950/70 text-zinc-400 hover:text-white hover:border-white/[0.16] transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              onPointerEnter={() => onAttentionChange?.('button')}
              onPointerLeave={() => onAttentionChange?.('cursor')}
              onFocus={() => onAttentionChange?.('button')}
              onBlur={() => onAttentionChange?.('cursor')}
              className={`flex-1 sm:flex-none min-h-12 min-w-[136px] px-6 rounded-xl font-sans font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 select-none active:scale-[0.98] cursor-pointer ${
                isLoading
                  ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                  : isComplete
                  ? 'bg-white hover:bg-zinc-100 text-zinc-950 shadow-md shadow-white/5'
                  : 'bg-white hover:bg-zinc-100 text-zinc-950 shadow-sm'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Consultando…</span>
                </>
              ) : (
                <>
                  <span>Consultar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Accessible Error Diagnostic */}
      {error && (
        <div
          id="cnpj-input-error"
          role="alert"
          className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-950/40 border border-red-800/60 text-xs font-mono text-red-300 animate-fade-in"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1"></span>
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Architectural Index Tags (Quick Demo Queries) */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
          Amostras Cadastrais:
        </span>
        {QUICK_SUGGESTIONS.map((item) => (
          <button
            key={item.cnpj}
            type="button"
            onClick={() => handleQuickSelect(item)}
            disabled={isLoading}
            className="group px-2.5 py-1 rounded-md bg-[#08080a] hover:bg-zinc-900 border border-white/[0.07] hover:border-marsala-500/40 text-zinc-400 hover:text-white font-mono text-[11px] transition duration-150 active:scale-95 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
          >
            <span className="text-zinc-300 group-hover:text-white font-medium">{item.name}</span>
            <span className="text-[9px] text-zinc-600 group-hover:text-marsala-300">[{item.code}]</span>
          </button>
        ))}
      </div>
    </div>
  );
}
