import React, { useMemo } from 'react';
import { attentionPoints, activityDuration, companySummary, companyView } from '../utils/companyAnalysis';
import { Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';

export default function BusinessAnalysis({ data }: { data: any }) {
  const view = useMemo(() => companyView(data), [data]);
  const points = attentionPoints(view);

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
    </section>
  );
}
