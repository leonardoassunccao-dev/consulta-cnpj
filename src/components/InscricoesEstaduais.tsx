import React from 'react';
import { formatBoolean, formatFallback } from '../utils/formatters';

interface IEItem {
  inscricao_estadual: string;
  ativo?: boolean | string;
  estado?: {
    sigla?: string;
    nome?: string;
  } | string;
  tipo_inscricao?: {
    descricao?: string;
  } | string;
  [key: string]: any;
}

interface InscricoesEstaduaisProps {
  data: any;
}

export default function InscricoesEstaduais({ data }: InscricoesEstaduaisProps) {
  const estab = data?.estabelecimento || {};
  const list: IEItem[] = estab.inscricoes_estaduais || [];

  if (list.length === 0) {
    return (
      <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-900/90 rounded-2xl p-6 text-center space-y-3">
        <div className="mx-auto w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-zinc-300 font-sans font-medium text-sm">Inscrições Estaduais</h3>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Nenhum registro de Inscrição Estadual foi retornado para o estabelecimento pesquisado.
        </p>
      </div>
    );
  }

  // Formats active indicators with elegant dots
  const renderStatusBadge = (status: any) => {
    const isActive = String(status).toLowerCase() === 'true' || status === true || String(status).toLowerCase() === 'ativa' || String(status).toLowerCase() === 'ativo';
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-900/50">
          <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
          Ativo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-zinc-900 text-zinc-400 border border-zinc-800">
        <span className="w-1 h-1 rounded-full bg-zinc-500"></span>
        Inativo
      </span>
    );
  };

  const getEstadoSigla = (est: any): string => {
    if (!est) return 'Não informado';
    if (typeof est === 'object') {
      return est.sigla || est.nome || 'Não informado';
    }
    return String(est);
  };

  const getTipoDesc = (tipo: any): string => {
    if (!tipo) return 'Padrão';
    if (typeof tipo === 'object') {
      return tipo.descricao || 'Padrão';
    }
    return String(tipo);
  };

  return (
    <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-900/90 rounded-2xl p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-zinc-200 tracking-tight flex items-center gap-2">
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Inscrições Estaduais ({list.length})
          </h3>
          <p className="text-xs text-zinc-500 text-left">Registros fiscais vinculados às Secretarias de Fazenda Estaduais.</p>
        </div>
      </div>

      {/* Desktop tabular view */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 text-zinc-500 font-mono uppercase tracking-wider">
              <th className="py-2.5 px-3">Estado</th>
              <th className="py-2.5 px-3">Inscrição Estadual</th>
              <th className="py-2.5 px-3">Situação</th>
              <th className="py-2.5 px-3">Tipo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/50">
            {list.map((item, index) => (
              <tr key={index} className="hover:bg-zinc-900/20 text-zinc-300 font-sans transition">
                <td className="py-3 px-3 font-semibold text-zinc-200">
                  {getEstadoSigla(item.estado)}
                </td>
                <td className="py-3 px-3 font-mono tracking-wider font-medium text-white">
                  {formatFallback(item.inscricao_estadual)}
                </td>
                <td className="py-3 px-3">
                  {renderStatusBadge(item.ativo)}
                </td>
                <td className="py-3 px-3 text-zinc-400">
                  {getTipoDesc(item.tipo_inscricao || item.tipo)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card stack view */}
      <div className="sm:hidden space-y-3">
        {list.map((item, index) => (
          <div key={index} className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-4 space-y-2.5 text-left text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-zinc-200">{getEstadoSigla(item.estado)}</span>
              {renderStatusBadge(item.ativo)}
            </div>
            <div className="space-y-1.5 font-sans pt-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">Inscrição:</span>
                <span className="font-mono text-zinc-300 font-semibold">{formatFallback(item.inscricao_estadual)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tipo:</span>
                <span className="text-zinc-400">{getTipoDesc(item.tipo_inscricao || item.tipo)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
