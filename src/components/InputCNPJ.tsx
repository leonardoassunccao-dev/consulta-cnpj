import React, { useState, useEffect, FormEvent } from 'react';

interface InputCNPJProps {
  onSearch: (cnpj: string) => void;
  onClear: () => void;
  isLoading: boolean;
  hasResult: boolean;
}

/**
 * Applies mask of 00.000.000/0000-00 to a numeric string
 */
export function applyCnpjMask(value: string): string {
  const digitsOnly = value.replace(/\D/g, '');
  const limited = digitsOnly.slice(0, 14);

  if (limited.length <= 2) return limited;
  if (limited.length <= 5) return `${limited.slice(0, 2)}.${limited.slice(2)}`;
  if (limited.length <= 8) return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5)}`;
  if (limited.length <= 12) {
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8)}`;
  }
  return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8, 12)}-${limited.slice(12)}`;
}

export default function InputCNPJ({ onSearch, onClear, isLoading, hasResult }: InputCNPJProps) {
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Clear visual input if application resets state
  useEffect(() => {
    if (!hasResult && !isLoading) {
      setInputValue('');
      setValidationError(null);
    }
  }, [hasResult, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const clean = rawVal.replace(/\D/g, '');
    
    // Limits strict digits to 14
    if (clean.length > 14) return;

    const masked = applyCnpjMask(clean);
    setInputValue(masked);

    // Dynamic error removal
    if (clean.length === 0) {
      setValidationError(null);
    } else if (clean.length === 14) {
      setValidationError(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();

    const clean = inputValue.replace(/\D/g, '');

    if (clean.length === 0) {
      setValidationError('Por favor, informe um CNPJ para prosseguir.');
      return;
    }

    if (clean.length !== 14) {
      setValidationError(`Um CNPJ deve possuir exatamente 14 dígitos numéricos. (Preenchido: ${clean.length}/14)`);
      return;
    }

    setValidationError(null);
    onSearch(clean);
  };

  const handleClearClick = () => {
    setInputValue('');
    setValidationError(null);
    onClear();
  };

  // List of rapid example CNPJs that work for demonstration/tutorial
  const handleTryDemo = (demoCnpj: string) => {
    const masked = applyCnpjMask(demoCnpj);
    setInputValue(masked);
    setValidationError(null);
    onSearch(demoCnpj);
  };

  const isFormValid = inputValue.replace(/\D/g, '').length === 14;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex flex-col md:flex-row items-stretch gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 focus-within:border-zinc-700 transition duration-200 shadow-xl shadow-black/40">
          
          {/* Decorative left magnifying glass svg */}
          <div className="flex items-center pl-3 pr-1 text-zinc-500">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            type="text"
            placeholder="Digite o CNPJ (ex: 00000000000191 ou 191)"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="flex-1 min-w-0 bg-transparent text-zinc-100 font-mono text-base md:text-lg focus:outline-none placeholder-zinc-600 disabled:text-zinc-500 py-2.5"
            aria-label="Input CNPJ"
          />

          <div className="flex items-center gap-2 mt-2 md:mt-0">
            {(inputValue || hasResult) && (
              <button
                type="button"
                onClick={handleClearClick}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition bg-zinc-800/80 hover:bg-zinc-800 rounded-xl"
              >
                Limpar
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition duration-150 flex items-center justify-center gap-2 select-none active:scale-95 ${
                isLoading 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50' 
                  : isFormValid 
                    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold cursor-pointer shadow-lg shadow-zinc-100/10'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer border border-zinc-700/50'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Consultando...
                </>
              ) : (
                'Consultar'
              )}
            </button>
          </div>
        </div>

        {validationError && (
          <p className="mt-2 text-xs md:text-sm text-red-400 flex items-center gap-1.5 pl-4 animate-fade-in font-sans">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {validationError}
          </p>
        )}
      </form>

      {!inputValue && !hasResult && !isLoading && (
        <div className="flex flex-col items-center gap-2 pt-2">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">CONSULTAS RÁPIDAS TELOG</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleTryDemo('19210785000155')}
              className="px-3 py-1.5 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 rounded-lg text-xs font-sans font-medium transition flex items-center gap-1.5 shadow-md hover:border-zinc-700"
            >
              🏢 TELOG Matriz
            </button>
            <button
              onClick={() => handleTryDemo('19210785000317')}
              className="px-3 py-1.5 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 rounded-lg text-xs font-sans font-medium transition flex items-center gap-1.5 shadow-md hover:border-zinc-700"
            >
              📍 TELOG São Paulo
            </button>
            <button
              onClick={() => handleTryDemo('19210785000589')}
              className="px-3 py-1.5 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 rounded-lg text-xs font-sans font-medium transition flex items-center gap-1.5 shadow-md hover:border-zinc-700"
            >
              📍 TELOG São José do Rio Preto
            </button>
            <button
              onClick={() => handleTryDemo('19210785000902')}
              className="px-3 py-1.5 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 rounded-lg text-xs font-sans font-medium transition flex items-center gap-1.5 shadow-md hover:border-zinc-700"
            >
              📍 TELOG Porto Alegre
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
