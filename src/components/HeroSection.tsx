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
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 md:pt-32 md:pb-36 text-center" aria-labelledby="hero-title">
      {/* Background: Pure AMOLED Black with an almost imperceptible, subtle marsala atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse 700px 350px at 50% 15%, rgba(139, 30, 63, 0.05), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Title & Short Subtitle */}
        <div className="space-y-4">
          <h1
            id="hero-title"
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-white leading-[1.12]"
          >
            Inteligência para decisões<br className="hidden sm:inline" /> entre empresas.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-400 font-normal">
            Informação empresarial. Sem complicação.
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
