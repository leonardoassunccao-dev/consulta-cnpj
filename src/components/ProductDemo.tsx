import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  ShieldCheck,
  Activity,
  Code2,
  ExternalLink,
  Search,
  Maximize2,
  RotateCcw,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';

interface ProductDemoProps {
  onSelect: (cnpj: string) => Promise<boolean>;
  isLoading: boolean;
}

const DEMO_COMPANY = {
  razaoSocial: 'PETRÓLEO BRASILEIRO S.A. - PETROBRAS',
  nomeFantasia: 'PETROBRAS',
  cnpj: '33.000.167/0001-01',
  rawCnpj: '33000167000101',
  situacaoCadastral: 'ATIVA',
  dataAbertura: '18/09/1953',
  tempoAtividade: '72a 1m 20d',
  capitalSocial: 'R$ 205.431.989.927,00',
  porte: 'Grande Porte (Demais)',
  naturezaJuridica: '203-8 — Sociedade de Economia Mista',
  municipioUf: 'Rio de Janeiro / RJ',
  totalVinculos: '+29',
  totalSocios: '9',
  cnaePrincipal: '06.00-0-01 — Extração de petróleo e gás natural',
};

export default function ProductDemo({ onSelect, isLoading }: ProductDemoProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'socios' | 'cnaes' | 'json'>('dashboard');
  const [is3DMode, setIs3DMode] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(DEMO_COMPANY, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-14 md:py-24 relative overflow-hidden" id="demonstracao" aria-labelledby="demo-title">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 space-y-8 text-left">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-white/[0.08] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#a8a49c]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dac5a7] animate-pulse"></span>
              <span>COCKPIT DE INTELIGÊNCIA CADASTRAL</span>
            </div>
            <h2 id="demo-title" className="text-2xl sm:text-4xl md:text-5xl font-sans font-light text-white tracking-tight">
              A interface como <span className="font-serif italic text-[#dac5a7]">demonstração</span>.
            </h2>
            <p className="text-sm md:text-base text-[#9e9b97] max-w-2xl leading-relaxed">
              Cockpit de inteligência cadastral de alto contraste, com acentos em champagne gold, telemetria de governança e visualização arquitetônica em tempo real.
            </p>
          </div>

          {/* Perspective 3D Tilt Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIs3DMode(!is3DMode)}
              className="px-3.5 py-1.5 rounded-lg bg-[#0a0a0e] border border-white/[0.1] hover:border-[#dac5a7]/50 text-xs font-mono text-zinc-300 hover:text-white transition flex items-center gap-2 cursor-pointer shadow-sm"
              title="Alternar ângulo de perspectiva 3D"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#dac5a7]" />
              <span>{is3DMode ? 'Visualização 3D Ativa' : 'Visualização Plana'}</span>
            </button>

            <button
              type="button"
              onClick={() => void onSelect(DEMO_COMPANY.rawCnpj)}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 font-sans text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
            >
              <span>Consultar ao Vivo</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 3D Perspective Container (Inspired by User Screenshot) */}
        <div className={`transition-all duration-500 ${is3DMode ? 'perspective-container py-4' : ''}`}>
          
          <div
            className={`rounded-2xl border border-white/[0.1] bg-[#070709] shadow-[0_35px_110px_rgba(0,0,0,0.98)] overflow-hidden transition-all duration-500 ${
              is3DMode ? 'perspective-dashboard' : ''
            }`}
          >
            
            {/* Main Application Layout: Left Icon Rail + Center Console */}
            <div className="flex flex-col md:flex-row min-h-[580px]">
              
              {/* 1. Left Vertical Icon Rail (Matching reference screenshot) */}
              <aside className="w-full md:w-16 bg-[#040406] border-b md:border-b-0 md:border-r border-white/[0.08] p-3 flex md:flex-col items-center justify-between shrink-0">
                <div className="flex md:flex-col items-center gap-4">
                  {/* Glowing Logo Mark */}
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#edd6b6] to-[#8c7a65] flex items-center justify-center text-[#0c0c0d] font-black font-mono text-xs shadow-[0_0_16px_rgba(218,197,167,0.4)] cursor-pointer">
                    CP
                  </div>

                  {/* Vertical Navigation Icons */}
                  <nav className="flex md:flex-col items-center gap-1.5 text-zinc-500 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('dashboard')}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        activeTab === 'dashboard'
                          ? 'bg-zinc-900 text-white border border-white/[0.1]'
                          : 'hover:text-zinc-200 hover:bg-white/[0.03]'
                      }`}
                      title="Dashboard Executivo"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('socios')}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        activeTab === 'socios'
                          ? 'bg-zinc-900 text-white border border-white/[0.1]'
                          : 'hover:text-zinc-200 hover:bg-white/[0.03]'
                      }`}
                      title="Quadro Societário (QSA)"
                    >
                      <Users className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('cnaes')}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        activeTab === 'cnaes'
                          ? 'bg-zinc-900 text-white border border-white/[0.1]'
                          : 'hover:text-zinc-200 hover:bg-white/[0.03]'
                      }`}
                      title="Atividades Econômicas (CNAE)"
                    >
                      <Activity className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('json')}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        activeTab === 'json'
                          ? 'bg-zinc-900 text-white border border-white/[0.1]'
                          : 'hover:text-zinc-200 hover:bg-white/[0.03]'
                      }`}
                      title="Visualizador JSON"
                    >
                      <Code2 className="w-4 h-4" />
                    </button>
                  </nav>
                </div>

                {/* Bottom Control Dot */}
                <div className="hidden md:flex flex-col items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Sincronização Ativa"></div>
                  <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-white/[0.08] flex items-center justify-center text-[10px] font-mono text-zinc-400">
                    RFB
                  </div>
                </div>
              </aside>

              {/* 2. Main Executive Command Dashboard */}
              <div className="flex-1 flex flex-col bg-[#07070a]">
                
                {/* Dashboard Top Header Bar */}
                <div className="px-6 py-3.5 border-b border-white/[0.08] bg-[#050507] flex flex-wrap items-center justify-between gap-4">
                  {/* Breadcrumb Title */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-zinc-400 font-semibold tracking-wide">Inteligência Cadastral</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                    <span className="text-white font-bold">Dashboard Executivo</span>
                    <span className="text-zinc-600 ml-1">/</span>
                    <span className="text-[#dac5a7] font-medium">{DEMO_COMPANY.cnpj}</span>
                  </div>

                  {/* Top Right Mini Search & Status */}
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-[#0a0a0d] border border-white/[0.06] text-xs font-mono text-zinc-400">
                      <Search className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{DEMO_COMPANY.razaoSocial}</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-[10px] font-mono font-bold text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>SITUAÇÃO ATIVA</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Core Body */}
                <div className="p-6 space-y-6 flex-1">
                  
                  {activeTab === 'dashboard' && (
                    <div className="space-y-6 animate-fade-in">
                      
                      {/* Top Metric Cards Row (Exact Match to Screenshot Hierarchy) */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        
                        <div className="p-5 rounded-xl bg-[#09090d] border border-white/[0.06] space-y-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Total Vínculos QSA</span>
                          <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                            {DEMO_COMPANY.totalVinculos}
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold">+47% de consistência cadastral</span>
                        </div>

                        <div className="p-5 rounded-xl bg-[#09090d] border border-white/[0.06] space-y-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Tempo de Atividade</span>
                          <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                            {DEMO_COMPANY.tempoAtividade}
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500">Abertura: 18/09/1953</span>
                        </div>

                        <div className="p-5 rounded-xl bg-[#09090d] border border-white/[0.06] space-y-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Impacto em SLA Cadastral</span>
                          <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                            0
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold">Zero pendências na RFB</span>
                        </div>

                        <div className="p-5 rounded-xl bg-[#09090d] border border-white/[0.06] space-y-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Filiais & Estabelecimentos</span>
                          <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                            14
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400">Rede corporativa nacional</span>
                        </div>

                      </div>

                      {/* Main Featured Command Card with SIGNATURE GLOWING CHAMPAGNE LINE */}
                      <div className="p-6 rounded-2xl bg-[#09090d] border border-white/[0.07] space-y-6 relative overflow-hidden">
                        
                        {/* Company Identification Banner */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-[#dac5a7] uppercase tracking-widest font-bold">
                              MATRIZ // GOVERNANÇA RFB
                            </span>
                            <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                              {DEMO_COMPANY.razaoSocial}
                            </h4>
                            <p className="text-xs text-zinc-400 font-mono">
                              {DEMO_COMPANY.naturezaJuridica} • Capital: {DEMO_COMPANY.capitalSocial}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] font-mono text-zinc-500">INTEGRIDADE CADASTRAL</span>
                            <div className="text-lg font-black font-mono text-white">100% REGULAR</div>
                          </div>
                        </div>

                        {/* SIGNATURE GLOWING CHAMPAGNE PROGRESS LINE */}
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-full rounded-full bg-zinc-950 overflow-hidden">
                            <div className="h-full w-[94%] rounded-full glow-champagne-bar"></div>
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                            <span>Sincronização com a base pública da Receita Federal</span>
                            <span className="text-[#dac5a7] font-bold">94% dos campos preenchidos</span>
                          </div>
                        </div>

                        {/* Bottom Split Layout: Activity Wave Chart + Severity / Distribution Bars */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                          
                          {/* Left Column (7 cols): Cadastral Continuity Area Wave Chart */}
                          <div className="lg:col-span-7 space-y-3">
                            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                              <span className="uppercase text-[11px] font-semibold text-zinc-300">Análise de Continuidade Operacional</span>
                              <span className="text-zinc-500 text-[10px]">1953 — 2026</span>
                            </div>

                            {/* SVG Champagne Area Wave Graph */}
                            <div className="h-36 w-full rounded-xl bg-[#060608] border border-white/[0.04] p-3 flex flex-col justify-between">
                              <svg className="w-full h-24 overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="champagneWave" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#dac5a7" stopOpacity="0.45" />
                                    <stop offset="100%" stopColor="#8c7a65" stopOpacity="0.0" />
                                  </linearGradient>
                                </defs>
                                {/* Area fill */}
                                <path
                                  d="M 0 85 Q 50 80, 100 70 T 200 45 T 300 15 T 400 30 L 400 100 L 0 100 Z"
                                  fill="url(#champagneWave)"
                                />
                                {/* Champagne wave stroke */}
                                <path
                                  d="M 0 85 Q 50 80, 100 70 T 200 45 T 300 15 T 400 30"
                                  fill="none"
                                  stroke="#dac5a7"
                                  strokeWidth="2.5"
                                />
                                {/* Peak point dot */}
                                <circle cx="300" cy="15" r="4" fill="#ffffff" stroke="#dac5a7" strokeWidth="2" />
                              </svg>

                              <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/[0.03]">
                                <span>Abertura (1953)</span>
                                <span>Expansão de Capital</span>
                                <span>Governança Colegiada</span>
                                <span className="text-white font-semibold">Vigente (2026)</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Column (5 cols): Distribution Split Bars (Severity / Structure) */}
                          <div className="lg:col-span-5 space-y-3">
                            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                              <span className="uppercase text-[11px] font-semibold text-zinc-300">Estrutura Operacional & CNAE</span>
                              <span className="text-zinc-500 text-[10px]">Segmentos</span>
                            </div>

                            <div className="p-3.5 rounded-xl bg-[#060608] border border-white/[0.04] space-y-3 font-mono text-xs">
                              {/* Bar 1: Extração (Main) */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-zinc-300">P1 — Extração de Petróleo e Gás</span>
                                  <span className="text-[#dac5a7] font-bold">100% (Principal)</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                                  <div className="h-full w-full bg-[#dac5a7] rounded-full shadow-[0_0_8px_rgba(218,197,167,0.4)]"></div>
                                </div>
                              </div>

                              {/* Bar 2: Refino */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-zinc-400">P2 — Refino e Combustíveis</span>
                                  <span className="text-zinc-300">82%</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                                  <div className="h-full w-[82%] bg-[#bfa583] rounded-full"></div>
                                </div>
                              </div>

                              {/* Bar 3: Transporte Dutoviário */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-zinc-400">P3 — Transporte Dutoviário</span>
                                  <span className="text-zinc-300">54%</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                                  <div className="h-full w-[54%] bg-[#8c7a65] rounded-full"></div>
                                </div>
                              </div>

                              <p className="text-[10px] text-zinc-500 pt-1 leading-tight">
                                Nenhum impacto negativo ou restrição cadastral registrada perante a RFB.
                              </p>
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                  {activeTab === 'socios' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2 border-b border-white/[0.06]">
                        <span className="text-white font-bold uppercase">Quadro Societário & Administradores (QSA)</span>
                        <span>{DEMO_COMPANY.totalSocios} MEMBROS CADASTRADOS</span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { nome: 'MAGDA MARIA DE REGINA CHAMBRIARD', cargo: 'Diretor-Presidente', faixa: '61 a 70 anos' },
                          { nome: 'FERNANDO REIS DE SANTANA', cargo: 'Diretor Executivo', faixa: '51 a 60 anos' },
                          { nome: 'MAURICIO TOLMASQUIM', cargo: 'Diretor Executivo Transição Energética', faixa: '61 a 70 anos' },
                          { nome: 'PIETRO ADAMO SAMPAIO MENDES', cargo: 'Presidente do Conselho de Administração', faixa: '41 a 50 anos' },
                        ].map((socio) => (
                          <div key={socio.nome} className="p-4 rounded-xl bg-[#09090d] border border-white/[0.06] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-[#dac5a7] border border-[#2d2b28] font-semibold">
                                {socio.cargo}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-500">{socio.faixa}</span>
                            </div>
                            <p className="text-sm font-bold text-white">{socio.nome}</p>
                            <span className="text-[10px] text-zinc-500 font-mono">Registro oficial perante a Receita Federal</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'cnaes' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="p-4 rounded-xl bg-[#09090d] border border-[#dac5a7]/40">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#dac5a7] font-bold">CNAE Principal</span>
                        <p className="text-sm font-bold font-mono text-white mt-1">{DEMO_COMPANY.cnaePrincipal}</p>
                      </div>

                      <div className="divide-y divide-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden bg-[#09090d] text-xs font-mono">
                        {[
                          ['19.21-7-00', 'Fabricação de produtos do refino de petróleo'],
                          ['46.81-8-01', 'Comércio atacadista de álcool carburante, biodiesel, gasolina e derivados'],
                          ['49.50-7-00', 'Transporte dutoviário'],
                          ['35.11-5-01', 'Geração de energia elétrica'],
                        ].map(([cod, desc]) => (
                          <div key={cod} className="p-3 flex items-center gap-3">
                            <span className="text-zinc-400 font-bold min-w-[90px]">{cod}</span>
                            <span className="text-zinc-200">{desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'json' && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                        <span>RESPOSTA BRUTA NORMALIZADA (JSON)</span>
                        <button
                          type="button"
                          onClick={handleCopyJson}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition active:scale-95 cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
                        </button>
                      </div>
                      <div className="p-4 rounded-xl bg-black border border-white/[0.08] font-mono text-xs text-zinc-300 overflow-x-auto max-h-72">
                        <pre>{JSON.stringify(DEMO_COMPANY, null, 2)}</pre>
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
