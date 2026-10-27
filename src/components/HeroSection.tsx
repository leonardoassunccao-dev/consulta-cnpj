import React from 'react';
import CompanySearch from './CompanySearch';

interface HeroSectionProps {
  onCnpjSearch: (cnpj: string) => Promise<boolean>;
  onClear: () => void;
  isLoading: boolean;
  hasCompany: boolean;
}

export default function HeroSection(props: HeroSectionProps) {
  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 md:pt-28 md:pb-32 text-center" aria-labelledby="hero-title">
      {/* Background: Arik Warm Moody Black Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse 900px 480px at 50% 15%, rgba(218, 197, 167, 0.04), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-5xl mx-auto px-4 space-y-8 sm:space-y-10">
        
        {/* Availability / System Pill (Arik signature bottom-left badge placed elegantly) */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141415] border border-[#2d2b28] text-[11px] font-mono text-[#a8a49c]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dac5a7] animate-pulse"></span>
            <span className="tracking-widest uppercase text-[10px]">BASE OFICIAL RFB 2026 // DISPONÍVEL</span>
          </div>
        </div>

        {/* Big Impact Editorial Typography (Arik Sans + Luxury Italic Serif) */}
        <div className="space-y-4 sm:space-y-5">
          <h1
            id="hero-title"
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-light tracking-tight text-white leading-[1.08]"
          >
            Inteligência Cadastral<br />
            <span className="font-serif italic font-normal text-[#dac5a7] text-4xl sm:text-6xl md:text-7xl lg:text-8xl block mt-1">
              para Empresas
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#9e9b97] font-normal max-w-xl mx-auto leading-relaxed">
            Consulte empresas, organize informações societárias e acesse os dados oficiais da Receita Federal com velocidade e profundidade.
          </p>
        </div>

        {/* Central Search Element */}
        <div className="pt-2 sm:pt-4">
          <CompanySearch {...props} />
        </div>

      </div>
    </section>
  );
}
