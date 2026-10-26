import React from 'react';
import ProductDemo from './ProductDemo';
import DifferentialsSection from './DifferentialsSection';
import TechArchitectureSection from './TechArchitectureSection';
import MethodologySection from './MethodologySection';
import HistoricoFavoritos from './HistoricoFavoritos';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface MainLandingProps {
  onSelect: (cnpj: string) => Promise<boolean>;
  isLoading: boolean;
  refreshTrigger: number;
}

export default function MainLanding({ onSelect, isLoading, refreshTrigger }: MainLandingProps) {
  return (
    <div className="space-y-16 md:space-y-24 animate-fade-in" id="recursos">
      {/* 1. Interactive Architectural Product Demonstration */}
      <ProductDemo onSelect={onSelect} isLoading={isLoading} />

      {/* 2. Asymmetric Editorial Differentials */}
      <DifferentialsSection />

      {/* 3. Technology & Reliability Architecture */}
      <TechArchitectureSection />

      {/* 4. Local Saved Queries & Favorites */}
      <div className="pt-2">
        <HistoricoFavoritos
          onSelect={onSelect}
          isLoading={isLoading}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* 5. Methodology & Ethics */}
      <MethodologySection />

      {/* 6. Leonardo LABS Studio Signature Callout */}
      <section className="py-16 md:py-24 border-t border-white/[0.06] text-center" id="leonardo-labs">
        <div className="w-full max-w-4xl mx-auto px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070709] border border-white/[0.08] text-xs font-mono text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-marsala-300" />
            <span className="tracking-widest uppercase text-[10px]">STUDIO LEONARDO LABS</span>
          </div>

          <h3 className="text-3xl sm:text-5xl font-sans font-black text-white tracking-tight">
            Engenharia de precisão para produtos digitais.
          </h3>

          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            O CNPJ Premium faz parte de um ecossistema de soluções desenhadas com rigor tipográfico, máxima segurança cadastral e foco na agilidade de tomadores de decisão.
          </p>

          <div className="pt-2">
            <a
              href="mailto:leonardo.assunccao@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-zinc-950 font-sans font-bold text-xs sm:text-sm hover:bg-zinc-200 transition shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Fale com o Desenvolvedor</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
