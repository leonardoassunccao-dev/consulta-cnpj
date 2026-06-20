import React, { useState } from 'react';
import { useCNPJ } from './hooks/useCNPJ';
import InputCNPJ from './components/InputCNPJ';
import ResumoEmpresa from './components/ResumoEmpresa';
import FiliaisTelog from './components/FiliaisTelog';
import InscricoesEstaduais from './components/InscricoesEstaduais';
import Metricas from './components/Metricas';
import JsonExplorer from './components/JsonExplorer';
import JsonModal from './components/JsonModal';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import { formatDataAsText } from './utils/jsonHelpers';

export default function App() {
  const {
    isLoading,
    data,
    error,
    errorType,
    consultarCNPJ,
    limpar,
  } = useCNPJ();

  const [isRawModalOpen, setIsRawModalOpen] = useState(false);
  const [copyRawFeedback, setCopyRawFeedback] = useState(false);
  const [copyTextFeedback, setCopyTextFeedback] = useState(false);

  const handleCopyRaw = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopyRawFeedback(true);
      setTimeout(() => setCopyRawFeedback(false), 2000);
    } catch (e) {
      console.error('Falha ao copiar:', e);
    }
  };

  const handleCopyFormatted = async () => {
    if (!data) return;
    try {
      const formattedText = formatDataAsText(data);
      await navigator.clipboard.writeText(formattedText);
      setCopyTextFeedback(true);
      setTimeout(() => setCopyTextFeedback(false), 2000);
    } catch (e) {
      console.error('Falha ao copiar:', e);
    }
  };

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
              
              {/* Dashboard metrics and control toolbar */}
              <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                <div className="text-left">
                  <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Painel Operacional</span>
                  <p className="text-xs text-zinc-400 mt-1">Veja as principais informações agrupadas, estatísticas de payload e registros de CNAE.</p>
                </div>

                {/* Micro operational actions */}
                <div className="flex flex-wrap items-center gap-2.5 self-start xl:self-center">
                  
                  {/* Button: Copy raw JSON */}
                  <button
                    onClick={handleCopyRaw}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 active:scale-95 ${
                      copyRawFeedback
                        ? 'bg-emerald-950/60 border-emerald-900/60 text-emerald-400'
                        : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-850 text-zinc-350 hover:text-white'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      {copyRawFeedback ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      )}
                    </svg>
                    {copyRawFeedback ? 'JSON Copiado!' : 'Copiar JSON'}
                  </button>

                  {/* Button: Copy formatted plain text */}
                  <button
                    onClick={handleCopyFormatted}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 active:scale-95 ${
                      copyTextFeedback
                        ? 'bg-emerald-950/60 border-emerald-900/60 text-emerald-400'
                        : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-850 text-zinc-350 hover:text-white'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      {copyTextFeedback ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2s" />
                      )}
                    </svg>
                    {copyTextFeedback ? 'Texto Copiado!' : 'Copiar Dados Formatados'}
                  </button>

                  <span className="text-zinc-800 hidden xl:inline">|</span>

                  {/* Button: Open raw fullscreen modal */}
                  <button
                    onClick={() => setIsRawModalOpen(true)}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold rounded-lg transition active:scale-95 shadow-md shadow-zinc-100/5 flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver JSON Bruto
                  </button>
                </div>
              </div>

              {/* Statistics widget cards */}
              <Metricas data={data} />

              {/* Enterprise Summary panel */}
              <ResumoEmpresa data={data} />

              {/* Hub de Filiais TELOG */}
              <FiliaisTelog
                currentCnpj={data?.estabelecimento?.cnpj || data?.cnpj || ''}
                onSelectFilial={consultarCNPJ}
                isLoading={isLoading}
              />

              {/* Layout columns for IE registrations & secondary tasks */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* State tax registrations panel */}
                <InscricoesEstaduais data={data} />

                {/* Quick informational companion card / partners */}
                <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-900/90 rounded-2xl p-6 space-y-4 shadow-xl text-left">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-zinc-205 flex items-center gap-2">
                      <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Quadro de Sócios e Administradores (QSA)
                    </h3>
                    <p className="text-xs text-zinc-500">Quadro societário registrado com cargos administrativos correspondentes.</p>
                  </div>

                  {data.socios && data.socios.length > 0 ? (
                    <div className="space-y-3 font-sans text-xs">
                      {data.socios.map((socio: any, i: number) => (
                        <div key={i} className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <p className="font-semibold text-zinc-200 capitalize">{socio.nome?.toLowerCase() || 'Não informado'}</p>
                            <p className="text-[10px] text-zinc-500">
                              Tipo: {socio.tipo_socio || 'Não informado'}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-[10px] rounded-lg text-zinc-400 font-medium">
                            {socio.qualificacao_socio?.descricao || 'Sócio'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-zinc-600 font-mono text-xs">
                      Nenhum sócio ou administrador encontrado.
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Interactive Tree explorer */}
              <JsonExplorer data={data} />

              {/* Raw JSON viewer modal popover */}
              <JsonModal
                isOpen={isRawModalOpen}
                onClose={() => setIsRawModalOpen(false)}
                data={data}
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
      <footer className="py-10 border-t border-zinc-900 bg-black/40 mt-auto text-zinc-400 font-sans" id="custom-app-footer">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1.5">
            <div className="flex items-center gap-2 group cursor-default">
              {/* Sleek SVG icon next to the name */}
              <svg className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition duration-200">
                Desenvolvido por <span className="text-zinc-100 font-semibold">Leonardo Assunção</span>
              </p>
            </div>
            <p className="text-xs text-zinc-500 max-w-md font-normal leading-relaxed">
              "Transformando problemas em soluções através da tecnologia."
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-1.5 text-xs text-zinc-500">
            <p className="font-normal text-zinc-600">
              © {new Date().getFullYear()} • Para colaboradores da Telog Logística
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
