import React from 'react';

interface Filial {
  nome: string;
  cnpj: string;
  uf: string;
  cidade: string;
}

interface FiliaisTelogProps {
  currentCnpj: string;
  onSelectFilial: (cnpj: string) => void;
  isLoading: boolean;
}

export const FILIAIS_DATA: Filial[] = [
  { nome: 'TELOG São Paulo', cnpj: '19210785000317', uf: 'SP', cidade: 'São Paulo' },
  { nome: 'TELOG Piracicaba', cnpj: '19210785000236', uf: 'SP', cidade: 'Piracicaba' },
  { nome: 'TELOG Itumbiara', cnpj: '19210785000660', uf: 'GO', cidade: 'Itumbiara' },
  { nome: 'TELOG Dourados', cnpj: '19210785000740', uf: 'MS', cidade: 'Dourados' },
  { nome: 'TELOG Goiânia', cnpj: '19210785000821', uf: 'GO', cidade: 'Goiânia' },
  { nome: 'TELOG Porto Alegre', cnpj: '19210785000902', uf: 'RS', cidade: 'Porto Alegre' },
  { nome: 'TELOG Cuiabá', cnpj: '19210785001046', uf: 'MT', cidade: 'Cuiabá' },
  { nome: 'TELOG São José dos Pinhais', cnpj: '19210785001127', uf: 'PR', cidade: 'São José dos Pinhais' },
];

export const MATRIZ_CNPJ = '19210785000155';

export function formatCnpj(cnpj: string): string {
  if (cnpj.length !== 14) return cnpj;
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
}

export default function FiliaisTelog({ currentCnpj, onSelectFilial, isLoading }: FiliaisTelogProps) {
  const cleanCnpj = currentCnpj.replace(/\D/g, '');
  
  // We check if the queried CNPJ is either the Matriz or one of the branches of Telog
  const isTelog = cleanCnpj === MATRIZ_CNPJ || FILIAIS_DATA.some(f => f.cnpj === cleanCnpj);

  if (!isTelog) return null;

  return (
    <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-900/90 rounded-2xl p-6 space-y-6 shadow-2xl text-left animate-fade-in" id="telog-filiais-hub">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900/65 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
              <svg className="w-4 h-4 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              🏢 Filiais TELOG
            </h3>
          </div>
          <p className="text-xs text-zinc-500">
            Total de {FILIAIS_DATA.length} filiais ativas organizadas por região de atuação logística.
          </p>
        </div>

        {/* Quick Back to Matriz shortcut */}
        {cleanCnpj !== MATRIZ_CNPJ && (
          <button
            onClick={() => onSelectFilial(MATRIZ_CNPJ)}
            disabled={isLoading}
            className="self-start md:self-center px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-350 hover:text-white border border-zinc-850 rounded-xl text-xs font-semibold transition active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0a9 9 0 0118 0z" />
            </svg>
            Voltar para Matriz
          </button>
        )}
      </div>

      {/* Grid listing of branches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {FILIAIS_DATA.map((filial) => {
          const isActive = cleanCnpj === filial.cnpj;
          return (
            <button
              key={filial.cnpj}
              onClick={() => {
                if (!isActive && !isLoading) {
                  onSelectFilial(filial.cnpj);
                }
              }}
              disabled={isLoading}
              className={`group flex flex-col justify-between p-4 rounded-xl border text-left transition duration-200 focus:outline-none ${
                isActive
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-950 shadow-lg shadow-zinc-100/5'
                  : 'bg-zinc-900/30 border-zinc-900 text-zinc-300 hover:bg-zinc-900/60 hover:border-zinc-800'
              } ${isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer active:scale-[0.98]'}`}
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-xs font-bold leading-snug ${isActive ? 'text-zinc-950 font-extrabold' : 'text-zinc-200 group-hover:text-white'}`}>
                    {filial.nome}
                  </p>
                  <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-mono font-bold tracking-wider ${
                    isActive 
                      ? 'bg-zinc-900/10 text-zinc-900' 
                      : 'bg-zinc-900 text-zinc-500 group-hover:text-zinc-400'
                  }`}>
                    {filial.uf}
                  </span>
                </div>
                <p className={`text-[10px] ${isActive ? 'text-zinc-700' : 'text-zinc-500'}`}>
                  {filial.cidade}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-dashed border-current/10">
                <span className={`font-mono text-[10px] tracking-wider ${isActive ? 'text-zinc-800 font-semibold' : 'text-zinc-500'}`}>
                  {formatCnpj(filial.cnpj)}
                </span>

                {isActive && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
