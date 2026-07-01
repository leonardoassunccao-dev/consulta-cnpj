import React, { useState } from 'react';
import { formatBoolean, formatFallback, formatDate } from '../utils/formatters';

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
  atualizado_em?: string;
  data_atualizacao?: string;
  [key: string]: any;
}

interface InscricoesEstaduaisProps {
  data: any;
}

export default function InscricoesEstaduais({ data }: InscricoesEstaduaisProps) {
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);

  const estab = data?.estabelecimento || {};
  const list: IEItem[] = Array.isArray(estab.inscricoes_estaduais) ? estab.inscricoes_estaduais : [];
  
  // Rule 1: Get the establishment's major state
  const siglaEstadoPrincipal = (estab.estado?.sigla || estab.uf || '').toUpperCase();

  // Basic empty check
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

  // Format active status indicator
  const renderStatusBadge = (status: any) => {
    const isActive = String(status).toLowerCase() === 'true' || status === true || String(status).toLowerCase() === 'ativa' || String(status).toLowerCase() === 'ativo';
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-900/50">
          <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
          Ativo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-zinc-900 text-zinc-400 border border-zinc-800">
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

  // Rule 2: Distinguish principal and secondary state registrations
  const principalIE = list.filter(item => {
    const itemSigla = getEstadoSigla(item.estado).toUpperCase();
    return itemSigla === siglaEstadoPrincipal;
  });

  const outrasIE = list.filter(item => {
    const itemSigla = getEstadoSigla(item.estado).toUpperCase();
    return itemSigla !== siglaEstadoPrincipal;
  });

  return (
    <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-900/90 rounded-2xl p-6 space-y-6 shadow-xl text-left">
      
      {/* Header section with Dynamic Title */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-zinc-200 tracking-tight flex items-center gap-2">
          <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Inscrição Estadual Principal {siglaEstadoPrincipal ? `(${siglaEstadoPrincipal})` : ''}
        </h3>
        <p className="text-xs text-zinc-500">
          Inscrição de cadastro fazendário principal correspondente à UF da sede pesquisada.
        </p>
      </div>

      {/* Rule 6: If no principal registration found */}
      {principalIE.length === 0 ? (
        <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xl text-left">
          <p className="text-xs text-zinc-400">
            Nenhuma inscrição estadual encontrada para o estado do estabelecimento ({siglaEstadoPrincipal || 'Não identificado'}).
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {principalIE.map((item, idx) => {
            const dataUpdate = item.atualizado_em || item.data_atualizacao || item.data_situacao;
            return (
              <div 
                key={idx} 
                className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl hover:border-zinc-800 transition space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Número da Inscrição</span>
                    <span className="font-mono text-sm font-bold text-white tracking-wider">
                      {formatFallback(item.inscricao_estadual)}
                    </span>
                  </div>
                  <div>
                    {renderStatusBadge(item.ativo)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-900 text-xs text-zinc-400">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-mono">Estado / UF</span>
                    <span className="font-semibold text-zinc-300">{getEstadoSigla(item.estado)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-mono">Tipo</span>
                    <span className="text-zinc-350">{getTipoDesc(item.tipo_inscricao || item.tipo)}</span>
                  </div>
                  {dataUpdate && (
                    <div className="col-span-2 pt-1 border-t border-zinc-900/50">
                      <span className="text-[10px] text-zinc-500 uppercase block font-mono">Data de Atualização</span>
                      <span className="text-zinc-355 font-mono">{formatDate(dataUpdate)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Observation Notice (Rule 14) */}
      <div className="flex gap-2 p-3 bg-zinc-900/10 border border-zinc-900/50 rounded-xl text-[11px] text-zinc-450 leading-relaxed">
        <svg className="w-4 h-4 text-zinc-650 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          Exibindo a inscrição estadual correspondente ao estado do estabelecimento consultado. Outras inscrições vinculadas podem existir em diferentes UFs.
        </p>
      </div>

      {/* Accordion area for other state registrations if they exist (Rule 4) */}
      {outrasIE.length > 0 && (
        <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-900/10 transition duration-150">
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full p-4 flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900/20 transition active:scale-[0.99]"
            aria-expanded={isAccordionOpen}
          >
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Outras inscrições estaduais vinculadas ({outrasIE.length})
            </span>
            <span className="text-zinc-500">
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isAccordionOpen ? 'rotate-180' : 'rotate-0'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          {isAccordionOpen && (
            <div className="p-4 border-t border-zinc-900 space-y-3.5 bg-black/10 max-h-[300px] overflow-y-auto custom-scrollbar animate-fade-in">
              {outrasIE.map((item, index) => {
                const itemDate = item.atualizado_em || item.data_atualizacao || item.data_situacao;
                return (
                  <div 
                    key={index} 
                    className="p-3.5 bg-zinc-950/40 border border-zinc-900/80 rounded-xl space-y-2.5 text-xs text-left"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold font-mono tracking-wider text-white">
                        {getEstadoSigla(item.estado)} • {formatFallback(item.inscricao_estadual)}
                      </span>
                      {renderStatusBadge(item.ativo)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900 text-[11px] text-zinc-400">
                      <div>
                        <span className="text-zinc-550 block">Tipo:</span>
                        <span className="text-zinc-300">{getTipoDesc(item.tipo_inscricao || item.tipo)}</span>
                      </div>
                      {itemDate && (
                        <div>
                          <span className="text-zinc-550 block">Atualização:</span>
                          <span className="text-zinc-350 font-mono">{formatDate(itemDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

