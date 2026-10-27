import React from 'react';
import { ArrowUpRight, ShieldCheck, Mail } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="border-t border-[#232220] bg-[#0a0a0b] text-[#9e9b97] font-sans mt-auto" id="custom-app-footer">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20 space-y-12 text-left">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Studio Signature (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="font-sans font-extrabold text-lg text-white tracking-tight">
                cnpj premium<span className="text-[#dac5a7]">.</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#6a6660] uppercase pl-2 border-l border-[#2d2b28]">
                Leonardo LABS
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#9e9b97] leading-relaxed max-w-sm font-normal">
              Plataforma de inteligência cadastral inspirada em design de alto padrão executivo. Transformamos dados públicos da Receita Federal em respostas imediatas e relatórios formais.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141415] border border-[#2d2b28] text-[11px] font-mono text-[#a8a49c]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#dac5a7] shrink-0" />
              <span>Privacidade absoluta: consultas sem retenção de dados</span>
            </div>
          </div>

          {/* Links: Navegação Rápida (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#dac5a7]">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#recursos" className="text-[#9e9b97] hover:text-[#dac5a7] transition-colors">
                  Recursos do Sistema
                </a>
              </li>
              <li>
                <a href="#processo" className="text-[#9e9b97] hover:text-[#dac5a7] transition-colors">
                  O Processo em 4 Passos
                </a>
              </li>
              <li>
                <a href="#demonstracao" className="text-[#9e9b97] hover:text-[#dac5a7] transition-colors">
                  Demonstração da Aplicação
                </a>
              </li>
              <li>
                <a href="#metodologia" className="text-[#9e9b97] hover:text-[#dac5a7] transition-colors">
                  Metodologia & Diretrizes
                </a>
              </li>
              <li>
                <a href="#sobre" className="text-[#9e9b97] hover:text-[#dac5a7] transition-colors">
                  Sobre a Leonardo LABS
                </a>
              </li>
            </ul>
          </div>

          {/* Links: Legal & Transparência (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#dac5a7]">
              Legal & Contato
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/privacidade.html" className="text-[#9e9b97] hover:text-[#dac5a7] transition-colors flex items-center gap-1.5">
                  <span>Política de Privacidade</span>
                  <ArrowUpRight className="w-3 h-3 text-[#6a6660]" />
                </a>
              </li>
              <li>
                <a href="/termos.html" className="text-[#9e9b97] hover:text-[#dac5a7] transition-colors flex items-center gap-1.5">
                  <span>Termos de Uso</span>
                  <ArrowUpRight className="w-3 h-3 text-[#6a6660]" />
                </a>
              </li>
              <li>
                <a href="/fontes-metodologia.html" className="text-[#9e9b97] hover:text-[#dac5a7] transition-colors flex items-center gap-1.5">
                  <span>Fontes e Dados Governamentais</span>
                  <ArrowUpRight className="w-3 h-3 text-[#6a6660]" />
                </a>
              </li>
              <li>
                <a href="mailto:leonardo.assunccao@gmail.com" className="text-[#9e9b97] hover:text-[#dac5a7] transition-colors flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-[#dac5a7]" />
                  <span>leonardo.assunccao@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider with subtle Accent Center */}
        <div className="relative border-t border-[#232220] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6a6660]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dac5a7]"></span>
            <span>© 2026 Leonardo LABS. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span>Criado por Leonardo Assunção</span>
            <span className="text-[#3d3b37]">•</span>
            <span>Ambiente Oficial de Produção</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
