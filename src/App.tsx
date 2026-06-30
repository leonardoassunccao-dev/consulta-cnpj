import React, { useState, useEffect } from 'react';
import { useCNPJ } from './hooks/useCNPJ';
import InputCNPJ from './components/InputCNPJ';
import FiliaisTelog from './components/FiliaisTelog';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import VisualizadorEmpresaTabs from './components/VisualizadorEmpresaTabs';
import HistoricoFavoritos from './components/HistoricoFavoritos';

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-100 selection:text-zinc-950">
      
      {/* Dynamic top gradient bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-zinc-900 via-zinc-400 to-zinc-900"></div>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8 md:space-y-12">
        
        {/* Workspace Brand / Header */}
        <header className="text-center space-y-3.5 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-white select-none">
            Consulta <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-450">CNPJ Premium</span>
          </h1>
          
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-lg mx-auto font-normal">
            Consulte instantaneamente dados de CNPJ junto à Receita Federal e visualize indicadores estatísticos com hierarquia estrutural completa.
          </p>
        </header>

        {/* Input form section */}
        <section className="relative z-10" id="search-console">
          <InputCNPJ
            onSearch={consultarCNPJ}
            onClear={limpar}
            isLoading={isLoading}
            hasResult={!!data}
          />
        </section>

        {/* Historico and Favorites (visible when there is NO active query results) */}
        {!isLoading && !data && (
          <section className="relative z-10 animate-fade-in">
            <HistoricoFavoritos
              onSelect={consultarCNPJ}
              isLoading={isLoading}
              refreshTrigger={refreshTrigger}
            />
          </section>
        )}

        {/* Core details workspace */}
        <section className="relative min-h-[300px]">
          
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

          {/* 4. Elegant Initial Placeholder State */}
          {!isLoading && !error && !data && (
            <div className="animate-fade-in py-6 max-w-4xl mx-auto space-y-8">
              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                
                {/* Visual block 1: High Fidelity */}
                <div className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl space-y-3 shadow-lg hover:border-zinc-850 transition">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-sans font-semibold text-sm text-zinc-200">Alta Performance</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                    Serviço otimizado com cache integrado e roteamento server-to-server para evitar gargalos e latência.
                  </p>
                </div>

                {/* Visual block 2: Zero CORS */}
                <div className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl space-y-3 shadow-lg hover:border-zinc-850 transition">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-sans font-semibold text-sm text-zinc-200">Segurança Total</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                    Servidor proxy privado impedindo a exposição de dados sensíveis nas requisições client-side do navegador.
                  </p>
                </div>

                {/* Visual block 3: Data Inspection */}
                <div className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl space-y-3 shadow-lg hover:border-zinc-850 transition">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="font-sans font-semibold text-sm text-zinc-200">Explorador JSON</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                    Ferramenta recursiva completa para explorar campos aninhados, arrays complexos e dados da Receita Federal.
                  </p>
                </div>
              </div>

              {/* Elegant empty instruction banner */}
              <div className="bg-zinc-950/60 border border-zinc-900 p-8 rounded-2xl text-center space-y-4 shadow-xl">
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-650">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-zinc-300 font-sans font-medium text-sm">Aguardando entrada de dados</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Digite um número de CNPJ válido no campo acima ou selecione um dos exemplos recomendados para preencher o console.
                  </p>
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
