import React from 'react';
import CompanySearch from './CompanySearch';
import { Database, Binary, Network, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onCnpjSearch: (cnpj: string) => Promise<boolean>;
  onClear: () => void;
  isLoading: boolean;
  hasCompany: boolean;
}

export default function HeroSection(props: HeroSectionProps) {
  return (
    <section className="relative pt-6 pb-16 md:pt-14 md:pb-24 overflow-hidden" aria-labelledby="hero-title">
      {/* Black Precision: Ambient Backlight & Blueprint Grid */}
      <div className="ambient-hero-marsala inset-0 -z-10" aria-hidden="true" />
      <div className="absolute inset-0 precision-grid -z-20 opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="w-full max-w-5xl mx-auto text-center space-y-8 sm:space-y-10">
        
        {/* Architectural Metadata Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#07070a] border border-white/[0.08] text-xs font-mono text-zinc-400 shadow-sm animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-marsala-accent animate-pulse"></span>
          <span className="tracking-widest uppercase text-[10px]">BLACK PRECISION</span>
          <span className="text-zinc-700">//</span>
          <span className="text-zinc-300 font-medium">INTELIGÊNCIA EMPRESARIAL CNPJ PREMIUM</span>
          <span className="text-zinc-700">//</span>
          <span className="text-zinc-500">LEONARDO LABS</span>
        </div>

        {/* Editorial Headline with Strong Typographic Scale */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1
            id="hero-title"
            className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight text-white leading-[1.06]"
          >
            Inteligência empresarial.<br />
            <span className="text-zinc-400 font-bold">Em cada consulta.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-zinc-400 font-normal leading-relaxed">
            Consulte empresas, organize informações cadastrais e descubra os dados que ajudam você a tomar decisões com mais contexto.
          </p>
        </div>

        {/* Central Search Interaction Instrument */}
        <div className="pt-2">
          <CompanySearch {...props} />
        </div>

        {/* Architectural Data Blueprint (Live Cadastral Hierarchy Preview) */}
        <div className="pt-6 max-w-4xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.08] bg-[#050507]/90 backdrop-blur-md p-5 sm:p-7 shadow-2xl text-left crosshair-corner">
            
            {/* Blueprint Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06] text-xs font-mono text-zinc-500">
              <div className="flex items-center gap-3">
                <span className="text-zinc-300 font-bold tracking-wider text-[11px]">
                  ESQUEMA ESTRUTURAL DE DADOS
                </span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-500 text-[10px]">BASE OFICIAL RFB 2026</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>FLUXO DIRETO SEM CAPTCHAS</span>
              </div>
            </div>

            {/* 4 Connected Architectural Modules */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-5 font-mono">
              
              <div className="p-3.5 rounded-xl bg-[#08080b] border border-white/[0.06] hover:border-marsala-500/40 transition">
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <Database className="w-3.5 h-3.5 text-zinc-300" />
                  <span className="text-[9px] uppercase tracking-widest text-zinc-600">01 / FONTE</span>
                </div>
                <div className="text-xs font-bold text-zinc-100">Receita Federal</div>
                <div className="text-[10px] text-zinc-500 mt-1">Registros públicos abertos de CNPJ</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08080b] border border-white/[0.06] hover:border-marsala-500/40 transition">
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <Binary className="w-3.5 h-3.5 text-marsala-300" />
                  <span className="text-[9px] uppercase tracking-widest text-zinc-600">02 / CHECKSUM</span>
                </div>
                <div className="text-xs font-bold text-zinc-100">Módulo 11 Client</div>
                <div className="text-[10px] text-zinc-500 mt-1">Validação dos 14 dígitos no navegador</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08080b] border border-white/[0.06] hover:border-marsala-500/40 transition">
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <Network className="w-3.5 h-3.5 text-zinc-300" />
                  <span className="text-[9px] uppercase tracking-widest text-zinc-600">03 / CONTEXTO</span>
                </div>
                <div className="text-xs font-bold text-zinc-100">Camadas por Assunto</div>
                <div className="text-[10px] text-zinc-500 mt-1">QSA, CNAEs, Inscrições e Endereço</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08080b] border border-white/[0.06] hover:border-marsala-500/40 transition">
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[9px] uppercase tracking-widest text-zinc-600">04 / PRIVACIDADE</span>
                </div>
                <div className="text-xs font-bold text-zinc-100">Armazenamento Local</div>
                <div className="text-[10px] text-zinc-500 mt-1">Histórico gravado apenas no seu dispositivo</div>
              </div>

            </div>

            {/* Architectural Footer Note */}
            <div className="mt-4 pt-3.5 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-marsala-accent"></span>
                <span>PADRÃO EDITORIAL LEONARDO LABS</span>
              </span>
              <span>DADOS PRESERVADOS EM ESTRUTURA ORIGINAL</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
