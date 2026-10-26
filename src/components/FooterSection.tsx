import React from 'react';
import { ArrowUpRight, ShieldCheck, Mail } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#020203] text-zinc-400 font-sans mt-auto" id="custom-app-footer">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20 space-y-12 text-left">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Studio Signature (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-white/[0.12] flex items-center justify-center font-mono text-xs font-black text-white">
                CP
              </div>
              <span className="font-sans font-bold text-lg text-white tracking-tight">
                CNPJ <span className="text-zinc-400 font-normal">Premium</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              Produto digital concebido e desenvolvido pela <strong className="text-zinc-200">Leonardo LABS</strong>. Transformamos registros cadastrais públicos da Receita Federal em inteligência empresarial com estética Black Precision e privacidade estrita.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#07070a] border border-white/[0.06] text-[11px] font-mono text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Projetado com respeito estrito à privacidade</span>
            </div>
          </div>

          {/* Links: Navegação Rápida (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#recursos" className="text-zinc-400 hover:text-white transition-colors">
                  Recursos do Sistema
                </a>
              </li>
              <li>
                <a href="#demonstracao" className="text-zinc-400 hover:text-white transition-colors">
                  Demonstração da Aplicação
                </a>
              </li>
              <li>
                <a href="#diferenciais" className="text-zinc-400 hover:text-white transition-colors">
                  Por que o CNPJ Premium?
                </a>
              </li>
              <li>
                <a href="#tecnologia" className="text-zinc-400 hover:text-white transition-colors">
                  Arquitetura & Engenharia
                </a>
              </li>
              <li>
                <a href="#metodologia" className="text-zinc-400 hover:text-white transition-colors">
                  Fontes & Critérios Éticos
                </a>
              </li>
            </ul>
          </div>

          {/* Links: Legal & Transparência (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300">
              Legal & Conformidade
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/privacidade.html" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Política de Privacidade</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a href="/termos.html" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Termos de Uso</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a href="/fontes-metodologia.html" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Fontes e Metodologia Governamental</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a href="mailto:leonardo.assunccao@gmail.com" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-zinc-500" />
                  <span>leonardo.assunccao@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider with subtle Marsala Accent Center */}
        <div className="relative border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-marsala-accent"></span>
            <span>© 2026 Leonardo LABS. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span>Criado por Leonardo Assunção</span>
            <span className="text-zinc-700">•</span>
            <span>Ambiente Oficial de Produção</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
