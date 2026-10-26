import React from 'react';
import { Database, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function ConsultationSources({ consultedAt }: { consultedAt: string }) {
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(consultedAt));

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#070709] p-6 space-y-4" aria-labelledby="sources-title">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-marsala-300" />
          <h3 id="sources-title" className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Transparência & Origem dos Dados
          </h3>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">
          Base Pública Governamental
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 text-xs">
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/[0.04]">
          <p className="text-zinc-500 font-mono text-[10px] uppercase">Fonte Oficial</p>
          <p className="mt-1 font-semibold text-zinc-200">Receita Federal do Brasil (RFB)</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Dados públicos de CNPJ</p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/[0.04]">
          <p className="text-zinc-500 font-mono text-[10px] uppercase">Camada de Normalização</p>
          <p className="mt-1 font-semibold text-zinc-200">CNPJ Premium Engine</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">QSA, CNAEs, Inscrições e Endereço</p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/[0.04]">
          <p className="text-zinc-500 font-mono text-[10px] uppercase">Data da Consulta</p>
          <p className="mt-1 font-semibold text-zinc-200">{formattedDate}</p>
          <p className="text-[10px] text-emerald-400 mt-0.5">Sessão criptografada no cliente</p>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500 border-t border-white/[0.04]">
        <span>
          Dados da fonte e análises derivadas são exibidos separadamente para total clareza.
        </span>
        <a
          href="/fontes-metodologia.html"
          className="inline-flex items-center gap-1 text-zinc-300 hover:text-white transition font-mono underline underline-offset-4"
        >
          <span>Metodologia detalhada</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </section>
  );
}
