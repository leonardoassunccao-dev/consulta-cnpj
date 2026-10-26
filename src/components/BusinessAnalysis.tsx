import React, { useMemo, useState } from 'react';
import { assessCompatibility, attentionPoints, activityDuration, companySummary, companyView } from '../utils/companyAnalysis';
import { Sparkles, ShieldCheck, AlertCircle, Briefcase } from 'lucide-react';

export interface HiringAnalysis {
  purpose: string;
  service: string;
  level: 'Alta' | 'Parcial' | 'Não identificada';
  explanation: string;
}

export default function BusinessAnalysis({
  data,
  onAnalysis,
}: {
  data: any;
  onAnalysis: (result: HiringAnalysis | null) => void;
}) {
  const view = useMemo(() => companyView(data), [data]);
  const [purpose, setPurpose] = useState('Fornecedor');
  const [service, setService] = useState('');
  const [result, setResult] = useState<HiringAnalysis | null>(null);
  const points = attentionPoints(view);

  function runAnalysis() {
    const compatibility = assessCompatibility(data, service);
    const next = { purpose, service, ...compatibility };
    setResult(next);
    onAnalysis(next);
  }

  return (
    <section className="space-y-5" aria-labelledby="business-analysis-title">
      <div className="flex flex-col gap-2 border-b border-white/[0.08] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-marsala-accent"></span>
            <span>ANÁLISE DE CONTEXTO CADASTRAL</span>
          </div>
          <h2 id="business-analysis-title" className="text-xl font-bold text-white tracking-tight mt-1">
            Contexto da empresa
          </h2>
        </div>
        <p className="text-xs text-zinc-500 font-mono">
          Dados da fonte e indicadores derivados • Sem score arbitrário
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-white/[0.08] bg-[#08080b] p-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-wider font-mono text-zinc-500">Situação Cadastral</p>
          <p className="mt-2 text-lg font-bold text-white">{view.status}</p>
        </article>
        <article className="rounded-xl border border-white/[0.08] bg-[#08080b] p-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-wider font-mono text-zinc-500">Tempo de Atividade</p>
          <p className="mt-2 text-base font-semibold text-zinc-200">{activityDuration(view.openedAt)}</p>
        </article>
        <article className="rounded-xl border border-white/[0.08] bg-[#08080b] p-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-wider font-mono text-zinc-500">Estrutura Societária</p>
          <p className="mt-2 text-sm font-semibold text-zinc-200">
            {view.partnersCount === null ? 'Não disponível na fonte pública' : `${view.partnersCount} integrante(s) informado(s)`}
          </p>
        </article>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#08080b] p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-marsala-300" />
          <span>Resumo Executivo</span>
        </div>
        <p className="text-sm leading-relaxed text-zinc-300">{companySummary(view)}</p>
        <p className="mt-2 text-xs text-zinc-500 pt-2 border-t border-white/[0.04]">
          O capital social declarado reflete o valor cadastrado na Receita Federal e não indica, isoladamente, capacidade financeira ou liquidez.
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#08080b] p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Pontos de Atenção Objetivos</span>
        </div>
        {points.length ? (
          <ul className="space-y-2 text-sm text-zinc-300">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Nenhum ponto de atenção objetivo foi identificado nos campos cadastrais disponíveis.
          </p>
        )}
      </div>

      {/* Hiring / Compatibility Analysis */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#070709] p-6 space-y-4" aria-labelledby="hiring-title">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            <Briefcase className="w-3.5 h-3.5 text-marsala-300" />
            <span>ANÁLISE DE COMPATIBILIDADE</span>
          </div>
          <h3 id="hiring-title" className="mt-1 text-lg font-bold text-white tracking-tight">
            Compatibilidade de Atividade para Contratação
          </h3>
        </div>

        <div className="grid gap-3 md:grid-cols-[180px_1fr_auto]">
          <label className="text-xs font-mono text-zinc-400">
            Finalidade
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl border border-white/[0.1] bg-zinc-950 px-3 text-sm text-white focus:outline-none focus:border-marsala-500/70"
            >
              <option>Fornecedor</option>
              <option>Prestador de serviço</option>
              <option>Transportadora</option>
              <option>Cliente</option>
              <option>Parceiro comercial</option>
              <option>Outro</option>
            </select>
          </label>

          <label className="text-xs font-mono text-zinc-400">
            Serviço ou atividade esperada
            <input
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="Ex.: Manutenção mecânica de veículos pesados"
              className="mt-1 min-h-11 w-full rounded-xl border border-white/[0.1] bg-zinc-950 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-marsala-500/70"
            />
          </label>

          <button
            type="button"
            onClick={runAnalysis}
            className="mt-5 min-h-11 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 transition cursor-pointer active:scale-95 shadow-sm"
          >
            Analisar Compatibilidade
          </button>
        </div>

        {result && (
          <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#0a0a0f] p-4 space-y-1 animate-fade-in">
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Grau de Compatibilidade da Atividade
            </p>
            <p className="text-base font-bold text-white flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${result.level === 'Alta' ? 'bg-emerald-400' : result.level === 'Parcial' ? 'bg-amber-400' : 'bg-red-400'}`}></span>
              {result.level}
            </p>
            <p className="text-sm leading-relaxed text-zinc-300 pt-1">{result.explanation}</p>
          </div>
        )}

        <p className="text-xs text-zinc-500 pt-2 border-t border-white/[0.04]">
          Esta análise possui caráter estritamente informativo e não substitui parecer técnico, certidões negativas ou diligência cadastral completa.
        </p>
      </div>
    </section>
  );
}
