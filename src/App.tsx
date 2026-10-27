import React, { useState, useEffect } from 'react';
import { useCNPJ } from './hooks/useCNPJ';
import FiliaisTelog from './components/FiliaisTelog';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import VisualizadorEmpresaTabs from './components/VisualizadorEmpresaTabs';
import ErrorBoundary from './components/ErrorBoundary';
import BusinessAnalysis, { HiringAnalysis } from './components/BusinessAnalysis';
import ConsultationSources from './components/ConsultationSources';
import CompanyComparison from './components/CompanyComparison';
import HeroSection from './components/HeroSection';
import MainLanding from './components/MainLanding';
import Navbar from './components/Navbar';
import FooterSection from './components/FooterSection';
import { FileText, ArrowRight } from 'lucide-react';

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
  const [hiringAnalysis, setHiringAnalysis] = useState<HiringAnalysis | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);

  const handleHomeClick = () => {
    limpar();
    const url = new URL(window.location.href);
    url.searchParams.delete('cnpj');
    window.history.replaceState({}, '', url.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateReport = async () => {
    if (!data || !consultedAt) return;
    setReportError(null);
    try {
      const { downloadCompanyReport } = await import('./utils/report');
      downloadCompanyReport(data, consultedAt, hiringAnalysis);
    } catch {
      setReportError('Não foi possível gerar o relatório neste momento. Tente novamente em alguns instantes.');
    }
  };

  // Sync successful search with local storage history
  useEffect(() => {
    if (data) {
      const timestamp = new Date().toISOString();
      setConsultedAt(timestamp);
      setHiringAnalysis(null);
      try {
        const historyCached = localStorage.getItem('premium_cnpj_history');
        let historyList = historyCached ? JSON.parse(historyCached) : [];
        if (!Array.isArray(historyList)) historyList = [];

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

          localStorage.setItem('premium_cnpj_history', JSON.stringify(historyList));
          const url = new URL(window.location.href);
          url.searchParams.set('cnpj', cnpjClean);
          window.history.replaceState({}, '', url.toString());
          setRefreshTrigger((prev) => prev + 1);
        }
      } catch (e) {
        console.error('Falha ao registrar histórico:', e);
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

                <BusinessAnalysis data={data} onAnalysis={setHiringAnalysis} />

                <CompanyComparison currentData={data} />

                {/* PDF Export Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[#2d2b28] bg-[#141415] p-5 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#181819] border border-[#2d2b28] text-[#dac5a7]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Relatório de Análise Empresarial</p>
                      <p className="mt-0.5 text-xs text-[#9e9b97]">PDF executivo diagramado com os dados disponíveis e a análise cadastral.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void generateReport()}
                    className="min-h-11 px-5 py-2.5 rounded-xl bg-[#dac5a7] text-[#0c0c0d] hover:bg-[#edd6b6] text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shrink-0 shadow-sm"
                  >
                    <span>Exportar Relatório PDF</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {reportError && (
                  <p role="alert" className="text-sm text-red-400 px-2 font-mono">
                    {reportError}
                  </p>
                )}

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
