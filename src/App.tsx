import React, { useState, useEffect } from 'react';
import { useCNPJ } from './hooks/useCNPJ';
import CompanySearch from './components/CompanySearch';
import FiliaisTelog from './components/FiliaisTelog';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import VisualizadorEmpresaTabs from './components/VisualizadorEmpresaTabs';
import HistoricoFavoritos from './components/HistoricoFavoritos';
import PlatformMockup from './components/PlatformMockup';
import ErrorBoundary from './components/ErrorBoundary';
import {
  Bookmark,
  Braces,
  Building2,
  Copy,
  History,
  Search,
  ShieldCheck,
} from 'lucide-react';

const DIFFERENTIALS = [
  {
    title: 'Consulta rápida por CNPJ',
    description: 'Consulte dados cadastrais de empresas brasileiras de forma rápida e organizada.',
    icon: Search,
  },
  {
    title: 'Dados organizados',
    description: 'Situação cadastral, atividades, endereço, capital social e outras informações importantes apresentadas sem ruído.',
    icon: Building2,
  },
  {
    title: 'Privacidade por padrão',
    description: 'Seu histórico e favoritos ficam no navegador, enquanto as consultas são processadas apenas para fornecer os resultados.',
    icon: ShieldCheck,
  },
  {
    title: 'JSON nativo',
    description: 'Acesse também os dados brutos da consulta quando precisar de informações técnicas ou integrações.',
    icon: Braces,
  },
] as const;

const SECONDARY_FEATURES = [
  { label: 'Favoritos', icon: Bookmark },
  { label: 'Histórico', icon: History },
  { label: 'Copiar dados', icon: Copy },
  { label: 'JSON', icon: Braces },
] as const;

export default function App() {
  const {
    isLoading,
    data,
    error,
    errorType,
    consultarCNPJ,
    limpar,
  } = useCNPJ();

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleHomeClick = () => {
    limpar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync successful search with local storage history
  useEffect(() => {
    if (data) {
      try {
        const historyCached = localStorage.getItem('premium_cnpj_history');
        let historyList = historyCached ? JSON.parse(historyCached) : [];
        if (!Array.isArray(historyList)) historyList = [];

        const cnpjClean = (data?.estabelecimento?.cnpj || data?.cnpj || '').replace(/\D/g, '');
        if (cnpjClean) {
          // Remove duplicate to bump current search to the top
          historyList = historyList.filter((item: any) => item.cnpj !== cnpjClean);

          historyList.unshift({
            razaoSocial: data.razao_social || 'Não informada',
            cnpj: cnpjClean,
            cidade: data.estabelecimento?.cidade?.nome || 'Não informada',
            uf: data.estabelecimento?.estado?.sigla || data.estabelecimento?.uf || '',
            consultadoEm: new Date().toISOString()
          });

          // Limit history size to 10 entries
          if (historyList.length > 10) {
            historyList.pop();
          }

          localStorage.setItem('premium_cnpj_history', JSON.stringify(historyList));
          setRefreshTrigger(prev => prev + 1);
        }
      } catch (e) {
        console.error('Falha ao registrar histórico:', e);
      }
    }
  }, [data]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 bg-grid-premium text-zinc-100 flex flex-col font-sans selection:bg-zinc-100 selection:text-zinc-950">
      
      {/* Sticky Premium Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-900/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo/Brand */}
            <button 
              onClick={handleHomeClick} 
              aria-label="Voltar para a página inicial"
              className="flex items-center gap-2 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 rounded-lg p-0.5 transition"
            >
              <span className="text-white font-display font-bold text-lg tracking-tight group-hover:opacity-90 group-active:opacity-75 transition duration-150">
                CNPJ <span className="text-zinc-400 font-medium">Premium</span>
              </span>
            </button>

            {/* Desktop Navigation links */}
            <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
              <a href="#recursos" className="hover:text-zinc-200 transition-colors duration-150">Recursos</a>
              <a href="#leonardo-labs" className="hover:text-zinc-200 transition-colors duration-150">Leonardo Labs</a>
            </div>
          </div>


        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16">
        
        {/* Hero Section */}
        <header className="text-center space-y-4 md:space-y-6 max-w-3xl mx-auto pt-8 md:pt-12">

          
          <h1 className="text-4xl md:text-6xl font-extrabold font-display tracking-tight text-white leading-tight select-none">
            Consulte empresas brasileiras <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">pelo CNPJ</span>.
          </h1>
          
          <p className="text-sm md:text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto font-normal">
            Consulte dados cadastrais de empresas brasileiras pelo CNPJ em uma experiência rápida e intuitiva.
          </p>
        </header>

        {/* Input form section */}
        <section className="relative z-10" id="search-console">
          <CompanySearch
            onCnpjSearch={consultarCNPJ}
            onClear={limpar}
            isLoading={isLoading}
            hasCompany={!!data}
          />
        </section>

        {/* Core details workspace */}
        <section className="relative min-h-[300px]">
          <ErrorBoundary onReset={limpar}>
            {/* 1. Loader State */}
            {isLoading && <LoadingSkeleton />}

            {/* 2. Error State */}
            {!isLoading && error && (
              <ErrorState
                error={error}
                errorType={errorType}
                onClear={limpar}
              />
            )}

            {/* 3. Successful State */}
            {!isLoading && !error && data && (
              <div className="space-y-8 animate-fade-in text-zinc-300">
                
                <VisualizadorEmpresaTabs
                  data={data}
                  onFavoriteToggle={() => setRefreshTrigger(prev => prev + 1)}
                />

                {/* Hub de Filiais TELOG */}
                <FiliaisTelog
                  currentCnpj={data?.estabelecimento?.cnpj || data?.cnpj || ''}
                  onSelectFilial={consultarCNPJ}
                  isLoading={isLoading}
                />

              </div>
            )}
          </ErrorBoundary>

          {/* 4. Elegant Initial Placeholder State / Marketing Landing page */}
          {!isLoading && !error && !data && (
            <div className="animate-fade-in max-w-5xl mx-auto space-y-24 md:space-y-36">
              
              {/* Giant Platform macOS Mockup Section */}
              <div className="space-y-4 text-center">
                <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest select-none">Demonstração</span>
                <h2 className="text-2xl md:text-4xl font-bold font-display text-white tracking-tight">Veja uma consulta completa em ação</h2>
                <p className="text-xs md:text-sm text-zinc-400 max-w-md mx-auto">
                  Do CNPJ à análise inteligente. Todos os dados organizados em uma única experiência.
                </p>
                <div className="pt-6">
                  <PlatformMockup />
                </div>
              </div>

              {/* Diferenciais principais */}
              <div className="text-center space-y-6" id="recursos">
                <div className="space-y-2">
                  <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest select-none">Diferenciais</span>
                  <h2 className="text-2xl md:text-4xl font-bold font-display text-white tracking-tight">Por que usar o CNPJ Premium?</h2>
                  <p className="text-xs md:text-sm text-zinc-400 max-w-lg mx-auto">
                    Dados empresariais organizados para consultar, encontrar e entender empresas com mais clareza.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 text-left pt-6">
                  {DIFFERENTIALS.map(({ title, description, icon: Icon }) => (
                    <article
                      key={title}
                      className="group min-h-48 p-6 md:p-7 bg-zinc-900/20 hover:bg-zinc-900/35 border border-zinc-900 hover:border-zinc-800 rounded-2xl transition-[background-color,border-color,transform] duration-200 ease-out md:hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      <div className="h-10 w-10 rounded-xl border border-zinc-800/80 bg-zinc-900/70 flex items-center justify-center text-zinc-300 transition-transform duration-200 ease-out md:group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
                        <Icon aria-hidden="true" size={19} strokeWidth={1.7} />
                      </div>
                      <div className="space-y-2 mt-6">
                        <h3 className="font-semibold text-base text-zinc-100">{title}</h3>
                        <p className="text-xs md:text-sm text-zinc-400 leading-relaxed max-w-xl">{description}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 pt-2 text-zinc-500" aria-label="Recursos adicionais">
                  {SECONDARY_FEATURES.map(({ label, icon: Icon }) => (
                    <div key={label} className="inline-flex items-center gap-2 text-xs font-medium">
                      <Icon aria-hidden="true" size={14} strokeWidth={1.7} />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recursos da plataforma (Visual & Product-Centric) */}
              <div className="text-center space-y-8">
                <div className="space-y-2">
                  <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest select-none">Tecnologia</span>
                  <h2 className="text-2xl md:text-4xl font-bold font-display text-white tracking-tight">Recursos avançados de engenharia</h2>
                  <p className="text-xs md:text-sm text-zinc-400 max-w-md mx-auto">
                    Desenvolvido com foco absoluto em desempenho, estabilidade de dados e ergonomia visual.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left pt-6 items-center">
                  
                  {/* Left Column: Descriptive pills */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-semibold font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                        Alta Performance
                      </div>
                      <h3 className="text-lg font-bold text-white">Velocidade inabalável</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Consultas em tempo real com barramento serverless otimizado. Carregamento de dados instantâneo sem telas de espera cansativas.
                      </p>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-zinc-900/60">
                      <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-semibold font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                        Segurança Militar
                      </div>
                      <h3 className="text-lg font-bold text-white">Criptografia em trânsito</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Garantia de integridade ponta a ponta. Suas conexões e buscas trafegam de forma oculta pelo proxy seguro sem expor dados do cliente.
                      </p>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-zinc-900/60">
                      <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-semibold font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                        Ergonomia Premium
                      </div>
                      <h3 className="text-lg font-bold text-white">Interface adaptável</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Desenvolvido sob rigoroso controle de contraste e grid adaptável de alta densidade para cansar menos a visão em longas sessões.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Premium micro-previews of system UI */}
                  <div className="lg:col-span-7 p-6 bg-zinc-900/10 border border-zinc-900 rounded-2xl space-y-4 shadow-xl">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 select-none block text-left">Micro visualizador de status do sistema</span>
                    
                    <div className="space-y-3">
                      {/* Active branch preview item */}
                      <div className="p-3.5 bg-zinc-950/60 border border-zinc-850 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-300">
                            🏢
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Matriz Cadastrada</p>
                            <p className="text-[9px] font-mono text-zinc-500">Piracicaba / SP</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-900/40 text-[9px] font-semibold text-emerald-400 font-mono">
                          REGULAR
                        </span>
                      </div>

                      {/* Partners preview item */}
                      <div className="p-3.5 bg-zinc-950/60 border border-zinc-850 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-300">
                            👤
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Quadro Societário</p>
                            <p className="text-[9px] font-mono text-zinc-500">Certificado QSA</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-medium text-zinc-400 font-mono">
                          2 Sócios
                        </span>
                      </div>

                      {/* Tech stack simulation item */}
                      <div className="p-3.5 bg-zinc-950/60 border border-zinc-850 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-300">
                            ⚡
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Velocidade média de resposta</p>
                            <p className="text-[9px] font-mono text-zinc-500">Latência de ponta a ponta</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-blue-950/30 border border-blue-900/40 text-[9px] font-bold text-blue-400 font-mono">
                          0.18s
                        </span>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* Historico and Favorites (rendered beautifully here on landing screen) */}
              <div className="space-y-6 pt-4 border-t border-zinc-900/40">
                <div className="text-center space-y-1">
                  <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest select-none">Suas Consultas</span>
                  <h3 className="text-lg font-bold text-white">Acesso Rápido</h3>
                </div>
                <HistoricoFavoritos
                  onSelect={consultarCNPJ}
                  isLoading={isLoading}
                  refreshTrigger={refreshTrigger}
                />
              </div>

              {/* Leonardo Labs Callout block (Editorial layout, very clean, generous negative space, no box) */}
              <div className="pt-12 pb-6 text-center max-w-2xl mx-auto space-y-6" id="leonardo-labs">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 select-none block">Ecossistema</span>
                
                <h3 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight">
                  Um produto Leonardo Labs
                </h3>
                
                <p className="text-sm text-zinc-400 leading-relaxed font-normal max-w-xl mx-auto">
                  Criamos produtos digitais para resolver problemas reais. O CNPJ Premium faz parte de um ecossistema construído para profissionais que valorizam velocidade, simplicidade e confiabilidade.
                </p>

                <div className="pt-4">
                  <a 
                    href="https://www.leonardolab.com.br/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white transition duration-150 relative group py-1"
                  >
                    <span>Conheça a Leonardo Labs</span>
                    <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    {/* Subtle underline hover effect */}
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-zinc-800 group-hover:bg-zinc-300 transition-colors"></span>
                  </a>
                </div>
              </div>

            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="py-14 border-t border-zinc-900 bg-[#09090b] text-zinc-400 font-sans mt-auto" id="custom-app-footer">
        <div className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center text-center space-y-6">
          
          {/* Upper Info Section */}
          <div className="space-y-3">
            <p className="text-sm font-semibold tracking-wide text-zinc-200">
              Um produto <span className="text-white hover:text-zinc-300 transition-colors cursor-default">Leonardo Labs</span>
            </p>
            
            <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500">
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Projetado com foco em privacidade.</span>
            </div>

            <p className="text-xs text-zinc-500 font-medium">
              Criado por <span className="text-zinc-300">Leonardo Assunção</span>
            </p>
          </div>

          {/* Sutil Separator Line */}
          <div className="w-24 h-[1px] bg-zinc-900"></div>

          {/* Middle Links Section */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-zinc-500 font-medium">
            <a href="#politica" className="hover:text-zinc-200 transition-colors duration-200">
              Política de Privacidade
            </a>
            <span className="text-zinc-800">•</span>
            <a href="#termos" className="hover:text-zinc-200 transition-colors duration-200">
              Termos de Uso
            </a>
            <span className="text-zinc-800">•</span>
            <a href="mailto:leonardo.assunccao@gmail.com" className="hover:text-zinc-200 transition-colors duration-200">
              Fale Conosco
            </a>
          </div>

          {/* Bottom Copyright Section */}
          <p className="text-[11px] text-zinc-650 font-mono tracking-wider">
            © 2026 Leonardo Labs. Todos os direitos reservados.
          </p>
          
        </div>
      </footer>
    </div>
  );
}
