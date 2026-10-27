import React from 'react';
import { Mail, Github, FileText, Shield } from 'lucide-react';

export default function ArikManifestoSection() {
  return (
    <section className="py-20 sm:py-32 overflow-hidden border-t border-[#232220] relative" id="sobre">
      {/* 1. Giant Editorial Marquee Banner (Arik Signature Marquee) */}
      <div className="w-full overflow-hidden select-none py-6 mb-12 sm:mb-20 opacity-20 hover:opacity-35 transition-opacity">
        <div className="animate-marquee flex items-center gap-12 font-sans font-light tracking-tighter text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white whitespace-nowrap">
          <span>CNPJ PREMIUM</span>
          <span className="font-serif italic text-[#dac5a7]">•</span>
          <span>CNPJ PREMIUM</span>
          <span className="font-serif italic text-[#dac5a7]">•</span>
          <span>CNPJ PREMIUM</span>
          <span className="font-serif italic text-[#dac5a7]">•</span>
          <span>CNPJ PREMIUM</span>
          <span className="font-serif italic text-[#dac5a7]">•</span>
          <span>CNPJ PREMIUM</span>
          <span className="font-serif italic text-[#dac5a7]">•</span>
          <span>CNPJ PREMIUM</span>
          <span className="font-serif italic text-[#dac5a7]">•</span>
        </div>
      </div>

      {/* 2. Dual-Column Studio Manifesto (Arik Screenshot 5 signature) */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
          
          {/* Left Column: Big Statement */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-sans font-light tracking-tight text-white leading-[1.15]">
              Informação que deixa <br />
              <span className="font-serif italic font-normal text-[#dac5a7] text-3xl sm:text-4xl md:text-5xl block mt-1">
                uma impressão duradoura!
              </span>
            </h3>
          </div>

          {/* Right Column: Bio / Philosophy + Circular Action Buttons */}
          <div className="lg:col-span-7 space-y-8">
            <p className="text-sm sm:text-base text-[#9e9b97] leading-relaxed font-normal">
              O <strong className="text-white font-semibold">CNPJ Premium</strong> foi idealizado pela{' '}
              <strong className="text-[#dac5a7] font-semibold">Leonardo LABS</strong> como uma resposta à proliferação de interfaces corporativas confusas e lentas. Projetado especificamente para analistas, empreendedores e tomadores de decisão que valorizam clareza tipográfica, respostas instantâneas e privacidade incondicional.
            </p>

            {/* Circular / Capsule Actions (Arik Screenshot 5 signature) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="mailto:leonardo.assunccao@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#141415] border border-[#2d2b28] hover:border-[#dac5a7] text-xs font-sans text-[#f5f3ef] hover:text-[#dac5a7] transition duration-200"
                aria-label="Enviar email"
              >
                <Mail className="w-3.5 h-3.5 text-[#dac5a7]" />
                <span>leonardo.assunccao@gmail.com</span>
              </a>

              <a
                href="https://github.com/leonardoassunccao-dev/consulta-cnpj"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#141415] border border-[#2d2b28] hover:border-[#dac5a7] text-xs font-sans text-[#f5f3ef] hover:text-[#dac5a7] transition duration-200"
                aria-label="Repositório GitHub"
              >
                <Github className="w-3.5 h-3.5 text-[#dac5a7]" />
                <span>GitHub</span>
              </a>

              <a
                href="/fontes-metodologia.html"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#141415] border border-[#2d2b28] hover:border-[#dac5a7] text-xs font-sans text-[#f5f3ef] hover:text-[#dac5a7] transition duration-200"
                aria-label="Metodologia e fontes"
              >
                <FileText className="w-3.5 h-3.5 text-[#dac5a7]" />
                <span>Metodologia</span>
              </a>

              <a
                href="/privacidade.html"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#141415] border border-[#2d2b28] hover:border-[#dac5a7] text-xs font-sans text-[#f5f3ef] hover:text-[#dac5a7] transition duration-200"
                aria-label="Política de privacidade"
              >
                <Shield className="w-3.5 h-3.5 text-[#dac5a7]" />
                <span>Privacidade</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
