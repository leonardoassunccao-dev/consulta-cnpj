import React, { useState, useEffect } from 'react';
import { useCNPJ } from './hooks/useCNPJ';
import FiliaisTelog from './components/FiliaisTelog';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import VisualizadorEmpresaTabs from './components/VisualizadorEmpresaTabs';
import ErrorBoundary from './components/ErrorBoundary';
import BusinessAnalysis from './components/BusinessAnalysis';
import ConsultationSources from './components/ConsultationSources';
import HeroSection from './components/HeroSection';
import MainLanding from './components/MainLanding';
import Navbar from './components/Navbar';
import FooterSection from './components/FooterSection';
import { filterExpiredHistory, isPrivacyModeActive, HISTORY_KEY, HistoryItem } from './utils/history';

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
  const [consultedAt, setConsultedAt] = useState<string | null>(null);

  const handleHomeClick = () => {
    limpar();
    const url = new URL(window.location.href);
    url.searchParams.delete('cnpj');
    window.history.replaceState({}, '', url.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync successful search with local storage history (if privacy mode is not active)
  useEffect(() => {
    if (data) {
      const timestamp = new Date().toISOString();
      setConsultedAt(timestamp);
      try {
        if (isPrivacyModeActive()) {
          return;
        }

        const historyCached = localStorage.getItem(HISTORY_KEY);
        let historyList: HistoryItem[] = historyCached ? JSON.parse(historyCached) : [];
        if (!Array.isArray(historyList)) historyList = [];

        // Prune entries older than 7 days
        historyList = filterExpiredHistory(historyList);

        const cnpjClean = (data?.estabelecimento?.cnpj || data?.cnpj || '').replace(/\D/g, '');
        if (cnpjClean) {
          // Remove duplicate to bump current search to top
          historyList = historyList.filter((item: any) => item.cnpj !== cnpjClean);

          historyList.unshift({
            razaoSocial: data.razao_social || 'Não informada',
            cnpj: cnpjClean,
            cidade: data.estabelecimento?.cidade?.nome || 'Não informada',
            uf: data.estabelecimento?.estado?.sigla || data.estabelecimento?.uf || '',
            consultadoEm: new Date().toISOString(),
          });

          // Limit history size to 10 entries
          if (historyList.length > 10) {
            historyList.pop();
          }

          localStorage.setItem(HISTORY_KEY, JSON.stringify(historyList));
          const url = new URL(window.location.href);
          url.searchParams.set('cnpj', cnpjClean);
          window.history.replaceState({}, '', url.toString());
          setRefreshTrigger((prev) => prev + 1);
        }
      } catch (e) {
        if (import.meta.env.DEV) {
          console.error('Falha ao registrar histórico:', e);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    const cnpj = new URLSearchParams(window.location.search).get('cnpj');
    if (cnpj) void consultarCNPJ(cnpj);
  }, [consultarCNPJ]);

  return (
    <div className="min-h-screen bg-[#0c0c0d] text-[#f5f3ef] flex flex-col font-sans selection:bg-[#dac5a7] selection:text-[#0c0c0d]">
      {/* Sticky High-End Floating Navigation Bar */}
      <Navbar onHomeClick={handleHomeClick} hasResult={Boolean(data)} />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-12">
        
        {/* Hero Section with Central Search */}
        <HeroSection
          onCnpjSearch={consultarCNPJ}
          onClear={limpar}
          isLoading={isLoading}
          hasCompany={Boolean(data)}
        />

        {/* Results / Landing View */}
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

            {/* 3. Successful State: Result Workspace */}
            {!isLoading && !error && data && (
              <div className="space-y-8 animate-fade-in text-zinc-300">
                <VisualizadorEmpresaTabs
                  data={data}
                  onFavoriteToggle={() => setRefreshTrigger((prev) => prev + 1)}
                />

                <BusinessAnalysis data={data} />

                {consultedAt && <ConsultationSources consultedAt={consultedAt} />}

                {/* Hub de Filiais TELOG (se aplicável) */}
                <FiliaisTelog
                  currentCnpj={data?.estabelecimento?.cnpj || data?.cnpj || ''}
                  onSelectFilial={consultarCNPJ}
                  isLoading={isLoading}
                />
              </div>
            )}
          </ErrorBoundary>

          {/* 4. Default State: High-End Main Landing */}
          {!isLoading && !error && !data && (
            <MainLanding
              onSelect={consultarCNPJ}
              isLoading={isLoading}
              refreshTrigger={refreshTrigger}
            />
          )}
        </section>
      </main>

      {/* Signature Studio Footer */}
      <FooterSection />
    </div>
  );
}
