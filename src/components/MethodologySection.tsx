import React from 'react';
import { ArrowUpRight, Scale, ShieldAlert, FileText } from 'lucide-react';

export default function MethodologySection() {
  return (
    <section className="py-14 md:py-24 border-t border-white/[0.06]" id="metodologia" aria-labelledby="method-title">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-10 text-left">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-marsala-accent"></span>
              <span>METODOLOGIA & DIRETRIZES ÉTICAS</span>
            </div>
            <h2 id="method-title" className="text-2xl sm:text-3xl md:text-4xl font-sans font-black text-white tracking-tight">
              Do dado bruto à decisão documentada.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Tratamos dados públicos com responsabilidade técnica e transparência ética, separando fatos cadastrais oficiais de interpretações analíticas.
            </p>
          </div>

          <a
            href="/fontes-metodologia.html"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/[0.08] hover:border-white/[0.18] text-xs font-semibold text-zinc-200 hover:text-white transition active:scale-95 shrink-0"
          >
            <span>Ver Documentação Completa</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 Ethical Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="p-6 rounded-2xl bg-[#060608] border border-white/[0.08] space-y-3 crosshair-corner">
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/[0.06] w-fit text-zinc-300">
              <Scale className="w-4 h-4 text-marsala-300" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Separação Rigorosa de Fatos
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              A situação cadastral, capital social, data de abertura e quadro societário são reproduções fiéis dos registros da Receita Federal. Análises de compatibilidade são claramente demarcadas como hipóteses de auxílio.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#060608] border border-white/[0.08] space-y-3 crosshair-corner">
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/[0.06] w-fit text-zinc-300">
              <ShieldAlert className="w-4 h-4 text-zinc-300" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Sem Scores Arbitrários
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              O CNPJ Premium rejeita a prática de atribuir pontuações de crédito fictícias ou automatizadas sem acesso a demonstrativos contábeis auditados. A decisão comercial permanece sob a responsabilidade de quem analisa.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#060608] border border-white/[0.08] space-y-3 crosshair-corner">
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/[0.06] w-fit text-zinc-300">
              <FileText className="w-4 h-4 text-zinc-300" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Limites & Conformidade
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Esta consulta cadastral não substitui certidões negativas de débitos tributários, certidões trabalhistas ou consultas a cartórios de protestos. Ela atua como ponto de partida rápido e estruturado para checagens cadastrais.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
