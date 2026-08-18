import React, { useEffect, useState } from 'react';

export default function PlatformMockup() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'geral' | 'endereco' | 'atividades' | 'contatos' | 'socios'>('geral');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-1 select-none py-4 relative" id="platform-interactive-mockup">
      
      {/* 1. floating callout left - Score Cadastral */}
      <div 
        className={`hidden xl:flex absolute -left-48 top-[38%] w-44 flex-col items-end text-right space-y-1.5 transition-all duration-1000 ease-out z-20 ${
          mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
        }`}
        style={{ transitionDelay: '1600ms' }}
      >
        <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-xl p-3 shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold text-white flex items-center justify-end gap-1 font-display">
            Score Cadastral
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          </p>
          <p className="text-[10px] text-zinc-400 leading-normal mt-1">
            Pontuação baseada na qualidade e preenchimento do cadastro público.
          </p>
        </div>
        {/* SVG connector line with a dot */}
        <svg className="w-24 h-8 text-blue-500/40" fill="none" viewBox="0 0 96 32">
          <path d="M96 16 H48 Q32 16 24 8 T0 0" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="94" cy="16" r="3" className="fill-blue-400" />
        </svg>
      </div>

      {/* 2. floating callout right - Resumo Inteligente */}
      <div 
        className={`hidden xl:flex absolute -right-48 top-[48%] w-44 flex-col items-start text-left space-y-1.5 transition-all duration-1000 ease-out z-20 ${
          mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}
        style={{ transitionDelay: '1800ms' }}
      >
        <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-xl p-3 shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold text-white flex items-center gap-1 font-display">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Resumo Inteligente
          </p>
          <p className="text-[10px] text-zinc-400 leading-normal mt-1">
            Resumo automático da empresa traduzindo dados brutos da Receita.
          </p>
        </div>
        {/* SVG connector line with a dot */}
        <svg className="w-24 h-8 text-emerald-500/40" fill="none" viewBox="0 0 96 32">
          <path d="M0 16 H48 Q64 16 72 24 T96 32" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="2" cy="16" r="3" className="fill-emerald-400" />
        </svg>
      </div>

      {/* 3. floating callout left lower - Dados Organizados */}
      <div 
        className={`hidden xl:flex absolute -left-48 bottom-[12%] w-44 flex-col items-end text-right space-y-1.5 transition-all duration-1000 ease-out z-20 ${
          mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
        }`}
        style={{ transitionDelay: '2000ms' }}
      >
        <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-xl p-3 shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold text-white flex items-center justify-end gap-1 font-display">
            Dados Organizados
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
          </p>
          <p className="text-[10px] text-zinc-400 leading-normal mt-1">
            Análise rápida das principais informações divididas em abas dedicadas.
          </p>
        </div>
        {/* SVG connector line with a dot */}
        <svg className="w-24 h-8 text-zinc-600/40" fill="none" viewBox="0 0 96 32">
          <path d="M96 16 H48 Q32 16 24 24 T0 32" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="94" cy="16" r="3" className="fill-zinc-400" />
        </svg>
      </div>

      {/* Main Container mimicking macOS perspective and elevation */}
      <div 
        className={`relative rounded-3xl border border-zinc-900 bg-zinc-950/20 p-2 md:p-3 shadow-[0_40px_120px_rgba(0,0,0,0.95)] transition-all duration-1000 ease-out ${
          mounted ? 'opacity-100 scale-[1.01] translate-y-0' : 'opacity-0 scale-95 translate-y-12'
        }`}
      >
        {/* Background glow effects for highlighted regions */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-emerald-500/5 via-transparent to-blue-500/5 opacity-40 blur-2xl -z-10"></div>
        
        {/* macOS Window Shell */}
        <div className="rounded-2xl overflow-hidden border border-zinc-800/60 bg-zinc-950 shadow-2xl backdrop-blur-xl">
          
          {/* Windows Title Bar */}
          <div className="h-12 border-b border-zinc-900 bg-zinc-900/10 px-5 flex items-center justify-between">
            {/* 3 Window traffic lights */}
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors cursor-pointer"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/60 hover:bg-yellow-500 transition-colors cursor-pointer"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-green-500/60 hover:bg-green-500 transition-colors cursor-pointer"></span>
            </div>

            {/* Address Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="h-7.5 rounded-lg bg-zinc-900/40 border border-zinc-850/40 flex items-center justify-center gap-1.5 text-[11px] font-mono text-zinc-500 px-4 truncate">
                <svg className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-zinc-300">cnpj.premium.labs</span>
                <span className="text-zinc-600 font-bold">/</span>
                <span className="text-zinc-400">consulta</span>
                <span className="text-zinc-600 font-bold">/</span>
                <span className="text-zinc-400 font-mono">42.109.876/0001-00</span>
              </div>
            </div>

            {/* Dummy system controls */}
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
              <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
            </div>
          </div>

          {/* Demonstration View Layout */}
          <div className="p-5 md:p-8 space-y-6 text-left">
            
            {/* Enterprise Header Area */}
            <div 
              className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5 transition-all duration-700 ease-out ${
                mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="space-y-1">
                <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest block font-bold">MOCKUP DE DEMONSTRAÇÃO</span>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight leading-none">
                    ACME TRANSPORTES LTDA
                  </h3>
                  
                  {/* Highlighted element 1: Empresa Ativa */}
                  <span 
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold font-sans uppercase tracking-widest border bg-emerald-950/90 text-emerald-400 border-emerald-900/80 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-500 ease-out ${
                      mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}
                    style={{ transitionDelay: '550ms' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Empresa Ativa
                  </span>
                  
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-mono font-medium text-zinc-500">
                    MATRIZ
                  </span>
                </div>

                <p className="text-xs text-zinc-400 font-mono flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
                  <span className="text-zinc-300">CNPJ: 42.109.876/0001-00</span>
                  <span className="text-zinc-700">•</span>
                  <span>ACME CARGO</span>
                  <span className="text-zinc-700">•</span>
                  <span>São Paulo / SP</span>
                </p>
              </div>

              {/* Fictional actions */}
              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1.5 bg-amber-950/30 border border-amber-900/60 text-amber-400 rounded-xl font-semibold flex items-center gap-1.5 cursor-not-allowed">
                  ★ Adicionado
                </span>
                <span className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 rounded-xl font-semibold cursor-not-allowed">
                  Exportar
                </span>
              </div>
            </div>

            {/* Mobile Callout indicators rendered inline (visible only under XL screens) */}
            <div className="xl:hidden grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-xs">
              <div className="space-y-1">
                <p className="font-bold text-blue-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Score Cadastral
                </p>
                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  Pontuação baseada na qualidade e preenchimento do cadastro público.
                </p>
              </div>
              <div className="space-y-1 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-zinc-900 md:pl-4">
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Resumo Inteligente
                </p>
                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  Resumo automático da empresa traduzindo dados brutos da Receita.
                </p>
              </div>
              <div className="space-y-1 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-zinc-900 md:pl-4">
                <p className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                  Dados Organizados
                </p>
                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  Análise rápida das principais informações divididas em abas dedicadas.
                </p>
              </div>
            </div>

            {/* Tabs simulator (Visão Geral active) */}
            <div className="flex overflow-x-auto pb-1 border-b border-zinc-900 scrollbar-none gap-1 opacity-100">
              {[
                { id: 'geral', label: 'Visão Geral', active: true },
                { id: 'endereco', label: 'Endereço', active: false },
                { id: 'atividades', label: 'Atividades', active: false },
                { id: 'contatos', label: 'Contatos', active: false },
                { id: 'socios', label: 'Sócios (QSA)', active: false },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => tab.id === 'geral' ? null : alert('Esta é uma simulação interativa da tela de resultados do CNPJ Premium.')}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl border transition-all flex-shrink-0 ${
                    tab.active
                      ? 'bg-zinc-100 border-zinc-200 text-zinc-950 font-bold shadow-lg shadow-zinc-100/5'
                      : 'bg-zinc-950/25 border-zinc-900/60 text-zinc-500 cursor-pointer hover:text-zinc-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Simulated Content Area */}
            <div className="space-y-6">
              
              {/* Bento Row: Highlighted Score and Resumo Inteligente */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Highlighted element 2: Score Cadastral Panel */}
                <div 
                  className={`lg:col-span-5 p-6 bg-gradient-to-b from-[#111115] to-[#0d0d10] border-2 border-blue-900/40 hover:border-blue-700/60 rounded-2xl flex flex-col justify-between gap-5 transition-all duration-800 ease-out shadow-[0_0_35px_rgba(59,130,246,0.06)] relative overflow-hidden ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: '800ms' }}
                >
                  {/* Subtle top background highlight */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500/20 via-blue-400/40 to-blue-500/20"></div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Score Cadastral Simples
                    </h4>
                    <p className="text-[10px] text-zinc-400 leading-normal mt-1 italic">
                      Pontuação baseada na qualidade do cadastro.
                    </p>
                  </div>

                  <div className="flex items-center gap-5 py-1">
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-blue-950 bg-black/50 shadow-inner">
                      <span className="text-2xl font-extrabold text-blue-400 font-mono">95</span>
                      <span className="text-[9px] text-zinc-500 absolute bottom-3">/ 100</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-bold text-zinc-300">Classificação</span>
                      <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: '95%' }}></div>
                      </div>
                      <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider block font-mono">
                        Excelente Consistência
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-zinc-900 pt-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                      <span>✅</span>
                      <span>CNPJ Ativo (+30 pts)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                      <span>✅</span>
                      <span>Mais de 10 anos de atividade (+20 pts)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                      <span>✅</span>
                      <span>Dados de contato completos (+15 pts)</span>
                    </div>
                  </div>
                </div>

                {/* Highlighted element 3: Resumo Inteligente Panel */}
                <div 
                  className={`lg:col-span-7 p-6 bg-gradient-to-b from-[#111115] to-[#0d0d10] border-2 border-emerald-900/40 hover:border-emerald-700/60 rounded-2xl flex flex-col justify-between gap-4 transition-all duration-800 ease-out shadow-[0_0_35px_rgba(16,185,129,0.06)] relative overflow-hidden ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: '1100ms' }}
                >
                  {/* Subtle top background highlight */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/20 via-emerald-400/40 to-emerald-500/20"></div>

                  <div>
                    <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Resumo Inteligente
                    </h4>
                    <p className="text-[10px] text-zinc-400 leading-normal mt-1 italic">
                      Resumo automático da empresa.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-xl leading-relaxed">
                    <p className="text-xs md:text-sm text-zinc-200 font-sans italic font-medium leading-relaxed">
                      "Empresa de grande porte ativa desde 2011, localizada em São Paulo/SP, com atuação de alta consistência no transporte rodoviário de cargas. Possui quadro societário regularizado, capital social declarado e todos os canais de contato ativos, resultando em uma pontuação excelente de conformidade cadastral."
                    </p>
                  </div>

                  <p className="text-[9px] text-zinc-500 leading-relaxed font-mono">
                    *Esta leitura é gerada de forma automatizada pela nossa engine baseando-se em dados de domínio público nacional.
                  </p>
                </div>

              </div>

              {/* Lower Secondary Elements (Slightly dimmed for focus weight contrast) */}
              <div 
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs transition-all duration-1000 ease-out ${
                  mounted ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: '1400ms' }}
                title="Passe o mouse para destacar os dados cadastrais completos"
              >
                <div className="p-4 bg-zinc-900/10 border border-zinc-900 rounded-xl space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Abertura</span>
                  <p className="text-zinc-300 font-semibold font-mono">15/06/2011 (15 anos)</p>
                </div>
                <div className="p-4 bg-zinc-900/10 border border-zinc-900 rounded-xl space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Capital Social</span>
                  <p className="text-zinc-300 font-semibold font-mono">R$ 1.500.000,00</p>
                </div>
                <div className="p-4 bg-zinc-900/10 border border-zinc-900 rounded-xl space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Atividade Principal (CNAE)</span>
                  <p className="text-zinc-300 font-semibold truncate">4930-2/02 - Transp. Rodoviário</p>
                </div>
              </div>

            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}
