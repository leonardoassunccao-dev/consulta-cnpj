import React from 'react';
import { ArrowUpRight, Scale, ShieldAlert, FileText } from 'lucide-react';

export default function MethodologySection() {
  return (
    <section className="py-14 sm:py-24 border-t border-[#232220]" id="metodologia" aria-labelledby="method-title">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-10 text-left">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#2d2b28] pb-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#a8a49c]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dac5a7]"></span>
              <span>METODOLOGIA & DIRETRIZES ÉTICAS</span>
            </div>
            <h2 id="method-title" className="text-2xl sm:text-4xl md:text-5xl font-sans font-light text-white tracking-tight leading-tight">
              Do dado bruto à <br />
              <span className="font-serif italic font-normal text-[#dac5a7]">
                decisão documentada.
              </span>
            </h2>
            <p className="text-[#9e9b97] text-sm sm:text-base max-w-2xl leading-relaxed">
              Tratamos dados públicos com responsabilidade técnica e transparência ética, separando fatos cadastrais oficiais de interpretações analíticas.
            </p>
          </div>

          <a
            href="/fontes-metodologia.html"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141415] border border-[#2d2b28] hover:border-[#dac5a7] text-xs font-sans text-[#f5f3ef] hover:text-[#dac5a7] transition duration-200 shrink-0"
          >
            <span>Ver Documentação Completa</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#dac5a7]" />
          </a>
        </div>

        {/* 3 Ethical Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-7 rounded-2xl bg-[#141415] border border-[#2d2b28] hover:border-[#dac5a7]/40 space-y-4 transition duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <div className="p-2.5 rounded-xl bg-[#181819] border border-[#2d2b28] w-fit text-[#dac5a7]">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Separação Rigorosa de Fatos
            </h3>
            <p className="text-xs sm:text-sm text-[#9e9b97] leading-relaxed">
              A situação cadastral, capital social, data de abertura e quadro societário são reproduções fiéis dos registros da Receita Federal. Análises de compatibilidade são claramente demarcadas como hipóteses de auxílio.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#141415] border border-[#2d2b28] hover:border-[#dac5a7]/40 space-y-4 transition duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <div className="p-2.5 rounded-xl bg-[#181819] border border-[#2d2b28] w-fit text-[#dac5a7]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Sem Scores Arbitrários
            </h3>
            <p className="text-xs sm:text-sm text-[#9e9b97] leading-relaxed">
              O CNPJ Premium rejeita a prática de atribuir pontuações de crédito fictícias ou automatizadas sem acesso a demonstrativos contábeis auditados. A decisão comercial permanece sob a responsabilidade de quem analisa.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#141415] border border-[#2d2b28] hover:border-[#dac5a7]/40 space-y-4 transition duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <div className="p-2.5 rounded-xl bg-[#181819] border border-[#2d2b28] w-fit text-[#dac5a7]">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Limites & Conformidade
            </h3>
            <p className="text-xs sm:text-sm text-[#9e9b97] leading-relaxed">
              Esta consulta cadastral não substitui certidões negativas de débitos tributários, certidões trabalhistas ou consultas a cartórios de protestos. Ela atua como ponto de partida rápido e estruturado para checagens cadastrais.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
