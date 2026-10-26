import React from 'react';
import { Building2, ArrowLeft } from 'lucide-react';

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
    <div className="bg-[#08080b] border border-white/[0.08] rounded-2xl p-6 space-y-6 shadow-xl text-left animate-fade-in" id="telog-filiais-hub">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-zinc-950 border border-white/[0.08] rounded-lg text-zinc-300">
              <Building2 className="w-4 h-4 text-marsala-300" />
            </span>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Hub de Filiais TELOG
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
            className="self-start md:self-center px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-white/[0.08] rounded-xl text-xs font-semibold transition active:scale-95 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para Matriz</span>
          </button>
        )}
      </div>

      {/* Grid listing of branches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                  ? 'bg-zinc-950 border-marsala-accent text-white shadow-md'
                  : 'bg-zinc-950/60 border-white/[0.05] text-zinc-300 hover:bg-zinc-900/60 hover:border-white/[0.12]'
              } ${isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer active:scale-[0.98]'}`}
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-xs font-bold leading-snug ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                    {filial.nome}
                  </p>
                  <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-mono font-bold tracking-wider ${
                    isActive 
                      ? 'bg-marsala-900 text-marsala-200 border border-marsala-700/50' 
                      : 'bg-zinc-900 text-zinc-500 group-hover:text-zinc-400'
                  }`}>
                    {filial.uf}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  {filial.cidade}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-white/[0.04]">
                <span className={`font-mono text-[10px] tracking-wider ${isActive ? 'text-zinc-200 font-semibold' : 'text-zinc-500'}`}>
                  {formatCnpj(filial.cnpj)}
                </span>

                {isActive && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
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
