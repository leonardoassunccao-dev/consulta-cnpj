import React, { useState, useMemo, useRef, useEffect } from 'react';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export default function JsonModal({ isOpen, onClose, data }: JsonModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copyStatus, setCopyStatus] = useState<'IDLE' | 'COPIED'>('IDLE');
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // Parse raw formatted json
  const rawJsonString = useMemo(() => {
    if (!data) return '';
    return JSON.stringify(data, null, 2);
  }, [data]);

  // Split string by lines to render line numbers & support search
  const jsonLines = useMemo(() => {
    return rawJsonString.split('\n');
  }, [rawJsonString]);

  // ESC key listener to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset copy feedback states
  useEffect(() => {
    if (copyStatus === 'COPIED') {
      const id = setTimeout(() => setCopyStatus('IDLE'), 1800);
      return () => clearTimeout(id);
    }
  }, [copyStatus]);

  // Compute number of search matches
  const matchCount = useMemo(() => {
    if (!searchQuery || !rawJsonString) return 0;
    try {
      const escapedQuery = searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(escapedQuery, 'gi');
      const occurrences = rawJsonString.match(regex);
      return occurrences ? occurrences.length : 0;
    } catch (e) {
      return 0;
    }
  }, [searchQuery, rawJsonString]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawJsonString);
      setCopyStatus('COPIED');
    } catch (e) {
      console.error('Falha ao copiar JSON:', e);
    }
  };

  if (!isOpen) return null;

  // Highlights search query in lines
  const renderHighlightedLine = (line: string) => {
    if (!searchQuery) return <span className="text-zinc-300">{line}</span>;

    const parts = line.split(new RegExp(`(${searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return (
      <span className="text-zinc-300">
        {parts.map((part, i) => 
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={i} className="bg-amber-400 text-black px-0.5 rounded font-bold font-mono">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Header toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-5 border-b border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-zinc-100 font-semibold font-sans">JSON Bruto</h3>
              <p className="text-xs text-zinc-500 font-mono">Total de linhas: {jsonLines.length}</p>
            </div>
          </div>

          {/* Search box inside JSON */}
          <div className="flex flex-1 max-w-md items-center gap-2 bg-zinc-900 border border-zinc-800/80 rounded-xl px-3 py-1.5 focus-within:border-zinc-700 transition">
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar palavra-chave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-zinc-200 text-xs focus:outline-none flex-1 font-mono"
            />
            {searchQuery && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                  {matchCount} {matchCount === 1 ? 'resultado' : 'resultados'}
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5">
            <button
              onClick={handleCopy}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all border shrink-0 flex items-center gap-1.5 active:scale-95 ${
                copyStatus === 'COPIED'
                  ? 'bg-emerald-950/60 border-emerald-900/60 text-emerald-400'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {copyStatus === 'COPIED' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                )}
              </svg>
              {copyStatus === 'COPIED' ? 'Copiado!' : 'Copiar JSON'}
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-lg transition active:scale-95"
              title="Fechar (ESC)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Code display area with lines */}
        <div 
          ref={codeContainerRef}
          className="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-6 bg-zinc-950/95 font-mono text-xs md:text-sm text-left select-text scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-800"
        >
          <div className="flex min-w-full">
            {/* Line numbers column */}
            <div className="text-zinc-650 pr-4 border-r border-zinc-900 text-right select-none select-none min-w-[3.5rem] tracking-tight">
              {jsonLines.map((_, idx) => (
                <div key={idx} className="h-5">{idx + 1}</div>
              ))}
            </div>

            {/* Content lines column */}
            <div className="pl-4 flex-1 whitespace-pre">
              {jsonLines.map((line, idx) => (
                <div key={idx} className="h-5 leading-5">
                  {renderHighlightedLine(line)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-910 bg-zinc-950 text-zinc-600 text-[10px] uppercase font-bold tracking-wider text-right">
          Pressione <kbd className="bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-zinc-450 mr-1">ESC</kbd> para fechar o visualizador
        </div>
      </div>
    </div>
  );
}
