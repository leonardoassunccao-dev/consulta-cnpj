import React, { useState } from 'react';
import {
  Building2,
  Users,
  MapPin,
  Briefcase,
  Code2,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Copy,
  Check,
} from 'lucide-react';

interface ProductDemoProps {
  onSelect: (cnpj: string) => Promise<boolean>;
  isLoading: boolean;
}

const SAMPLE_DEMO_DATA = {
  razaoSocial: 'PETRÓLEO BRASILEIRO S.A. - PETROBRAS',
  nomeFantasia: 'PETROBRAS',
  cnpj: '33.000.167/0001-01',
  rawCnpj: '33000167000101',
  situacaoCadastral: 'ATIVA',
  dataAbertura: '18/09/1953',
  tempoAtividade: '72 anos de atividade ininterrupta',
  porte: 'Demais (Grande Porte)',
  naturezaJuridica: '203-8 — Sociedade de Economia Mista',
  capitalSocial: 'R$ 205.431.989.927,00',
  cnaePrincipal: {
    codigo: '06.00-0-01',
    descricao: 'Extração de petróleo e gás natural',
  },
  cnaesSecundarios: [
    { codigo: '19.21-7-00', descricao: 'Fabricação de produtos do refino de petróleo' },
    { codigo: '46.81-8-01', descricao: 'Comércio atacadista de álcool carburante, biodiesel, gasolina e derivados' },
    { codigo: '49.50-7-00', descricao: 'Transporte dutoviário' },
    { codigo: '35.11-5-01', descricao: 'Geração de energia elétrica' },
  ],
  endereco: {
    tipo: 'Avenida',
    logradouro: 'República do Chile',
    numero: '65',
    complemento: 'Edifício Sede',
    bairro: 'Centro',
    municipio: 'Rio de Janeiro',
    uf: 'RJ',
    cep: '20031-912',
  },
  socios: [
    { nome: 'MAGDA MARIA DE REGINA CHAMBRIARD', qualificacao: 'Diretor-Presidente', faixaEtaria: '61 a 70 anos' },
    { nome: 'FERNANDO REIS DE SANTANA', qualificacao: 'Diretor Executivo', faixaEtaria: '51 a 60 anos' },
    { nome: 'MAURICIO TOLMASQUIM', qualificacao: 'Diretor Executivo Transição Energética', faixaEtaria: '61 a 70 anos' },
    { nome: 'PIETRO ADAMO SAMPAIO MENDES', qualificacao: 'Presidente do Conselho de Administração', faixaEtaria: '41 a 50 anos' },
  ],
};

export default function ProductDemo({ onSelect, isLoading }: ProductDemoProps) {
  const [activeTab, setActiveTab] = useState<'geral' | 'socios' | 'atividades' | 'endereco' | 'json'>('geral');
  const [copied, setCopied] = useState(false);

  const handleCopySampleJson = () => {
    const jsonStr = JSON.stringify(SAMPLE_DEMO_DATA, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-14 md:py-24" id="demonstracao" aria-labelledby="demo-title">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-white/[0.08] pb-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-marsala-accent"></span>
              <span>A INTERFACE COMO DEMONSTRAÇÃO</span>
            </div>
            <h2 id="demo-title" className="text-2xl sm:text-3xl md:text-4xl font-sans font-black text-white tracking-tight">
              Apresentação arquitetônica de dados.
            </h2>
            <p className="text-sm md:text-base text-zinc-400 max-w-2xl leading-relaxed">
              Estruturação visual de ponta a ponta: dados cadastrais oficiais ganham clareza executiva para rápida compreensão e auditoria.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="px-3 py-1.5 rounded-md bg-[#08080a] border border-white/[0.08]">
              Amostra Real: Petrobras (RFB)
            </span>
          </div>
        </div>

        {/* Architectural Dashboard Terminal Frame */}
        <div className="rounded-2xl border border-white/[0.1] bg-[#050507] shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden crosshair-corner">
          
          {/* Top Frame Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 bg-[#08080b] border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800"></span>
              </div>
              <div className="hidden sm:flex items-center gap-2 ml-2 px-3 py-1 rounded bg-[#030304] border border-white/[0.06] text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-600">https://</span>
                <span className="text-zinc-300">cnpjpremium.com.br/consulta/</span>
                <span className="text-marsala-300 font-semibold">{SAMPLE_DEMO_DATA.rawCnpj}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>BASE OFICIAL RFB SINCRONIZADA</span>
            </div>
          </div>

          {/* Company Title Header */}
          <div className="p-6 sm:p-8 border-b border-white/[0.08] bg-[#07070a]/70">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06]">
                    MATRIZ
                  </span>
                  <span className="font-mono text-xs text-zinc-300">
                    {SAMPLE_DEMO_DATA.cnpj}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {SAMPLE_DEMO_DATA.situacaoCadastral}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-white/[0.06]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Validado Módulo 11
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-sans font-black text-white tracking-tight">
                  {SAMPLE_DEMO_DATA.razaoSocial}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-mono">
                  {SAMPLE_DEMO_DATA.naturezaJuridica} • Rio de Janeiro / RJ
                </p>
              </div>

              {/* Direct Search Trigger Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => void onSelect(SAMPLE_DEMO_DATA.rawCnpj)}
                  disabled={isLoading}
                  className="px-5 py-3 rounded-xl font-sans text-xs sm:text-sm font-bold bg-white text-zinc-950 hover:bg-zinc-100 transition shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Executar Consulta Real</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Architectural Tabs Navigation */}
          <div className="flex overflow-x-auto px-6 pt-3 border-b border-white/[0.08] gap-1 bg-[#060608]">
            {[
              { id: 'geral', label: 'Visão Geral', icon: Building2 },
              { id: 'socios', label: 'Quadro Societário (QSA)', icon: Users },
              { id: 'atividades', label: 'Atividades Econômicas', icon: Briefcase },
              { id: 'endereco', label: 'Endereço Fiscal', icon: MapPin },
              { id: 'json', label: 'Payload JSON', icon: Code2 },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === id
                    ? 'border-marsala-accent text-white bg-zinc-950'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${activeTab === id ? 'text-marsala-300' : 'text-zinc-500'}`} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Display Area */}
          <div className="p-6 sm:p-8 bg-[#040406] min-h-[360px]">
            {activeTab === 'geral' && (
              <div className="space-y-6 animate-fade-in text-left">
                {/* 4 Architectural Metric Cells */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-xl bg-[#07070a] border border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Capital Social</span>
                    <p className="mt-1.5 text-base sm:text-lg font-bold font-mono text-white truncate">
                      {SAMPLE_DEMO_DATA.capitalSocial}
                    </p>
                    <span className="text-[10px] text-zinc-500">Declarado na RFB</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07070a] border border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Data de Abertura</span>
                    <p className="mt-1.5 text-base sm:text-lg font-bold font-mono text-white">
                      {SAMPLE_DEMO_DATA.dataAbertura}
                    </p>
                    <span className="text-[10px] text-emerald-400">{SAMPLE_DEMO_DATA.tempoAtividade}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07070a] border border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Porte Declarado</span>
                    <p className="mt-1.5 text-base sm:text-lg font-bold text-white truncate">
                      {SAMPLE_DEMO_DATA.porte}
                    </p>
                    <span className="text-[10px] text-zinc-500">Sociedade de Grande Porte</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07070a] border border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Sócios & QSA</span>
                    <p className="mt-1.5 text-base sm:text-lg font-bold text-white">
                      {SAMPLE_DEMO_DATA.socios.length} integrantes
                    </p>
                    <span className="text-[10px] text-zinc-500">Governança mapeada</span>
                  </div>
                </div>

                {/* Structured Summary & Primary Economic Classification */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-[#07070a] border border-white/[0.06] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-marsala-accent"></span>
                      <span>Resumo Cadastral Inteligente</span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      Sociedade de economia mista ativa há mais de sete décadas no segmento estratégico de extração de petróleo e gás natural. Apresenta governança colegiada estruturada perante a Receita Federal do Brasil, com quadro societário mapeado e regularidade cadastral vigente.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#07070a] border border-white/[0.06] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Atividade Econômica Principal</span>
                    </div>
                    <div className="font-mono text-sm font-semibold text-white">
                      {SAMPLE_DEMO_DATA.cnaePrincipal.codigo}
                    </div>
                    <p className="text-sm text-zinc-300">
                      {SAMPLE_DEMO_DATA.cnaePrincipal.descricao}
                    </p>
                    <p className="text-xs text-zinc-500 pt-1 font-mono">
                      Total de 4 atividades secundárias registradas no CNPJ.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'socios' && (
              <div className="space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2 border-b border-white/[0.06]">
                  <span>RELAÇÃO DE ADMINISTRADORES / QUADRO SOCIETÁRIO (QSA)</span>
                  <span>{SAMPLE_DEMO_DATA.socios.length} INTEGRANTES CADASTRADOS</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SAMPLE_DEMO_DATA.socios.map((socio) => (
                    <div
                      key={socio.nome}
                      className="p-4 rounded-xl bg-[#07070a] border border-white/[0.06] space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-white/[0.06]">
                          {socio.qualificacao}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {socio.faixaEtaria}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white">
                        {socio.nome}
                      </p>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Registro oficial perante a Receita Federal
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'atividades' && (
              <div className="space-y-4 animate-fade-in text-left">
                <div className="p-4 rounded-xl bg-[#07070a] border border-marsala-500/40">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-marsala-300">CNAE Principal</span>
                  <p className="text-sm font-bold font-mono text-white mt-1">
                    {SAMPLE_DEMO_DATA.cnaePrincipal.codigo} — {SAMPLE_DEMO_DATA.cnaePrincipal.descricao}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Atividades Econômicas Secundárias (CNAEs)
                  </span>
                  <div className="divide-y divide-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden bg-[#07070a]">
                    {SAMPLE_DEMO_DATA.cnaesSecundarios.map((item) => (
                      <div key={item.codigo} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-mono text-zinc-400 min-w-[100px] shrink-0 font-semibold">
                          {item.codigo}
                        </span>
                        <span className="text-zinc-200">{item.descricao}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'endereco' && (
              <div className="space-y-4 animate-fade-in text-left">
                <div className="p-5 rounded-xl bg-[#07070a] border border-white/[0.06] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span>Endereço Fiscal Cadastrado</span>
                  </div>
                  <p className="text-base sm:text-lg font-medium text-white">
                    {SAMPLE_DEMO_DATA.endereco.tipo} {SAMPLE_DEMO_DATA.endereco.logradouro}, {SAMPLE_DEMO_DATA.endereco.numero}
                    {SAMPLE_DEMO_DATA.endereco.complemento ? ` — ${SAMPLE_DEMO_DATA.endereco.complemento}` : ''}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
                    <div>
                      <span className="text-zinc-500">Bairro:</span>
                      <p className="text-zinc-200">{SAMPLE_DEMO_DATA.endereco.bairro}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Município / UF:</span>
                      <p className="text-zinc-200">{SAMPLE_DEMO_DATA.endereco.municipio} - {SAMPLE_DEMO_DATA.endereco.uf}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">CEP:</span>
                      <p className="text-zinc-200">{SAMPLE_DEMO_DATA.endereco.cep}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Jurisdição:</span>
                      <p className="text-zinc-200">RFB Rio de Janeiro</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'json' && (
              <div className="space-y-3 animate-fade-in text-left">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>RESPOSTA BRUTA NORMALIZADA (JSON)</span>
                  <button
                    type="button"
                    onClick={handleCopySampleJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition active:scale-95 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-black border border-white/[0.08] font-mono text-xs text-zinc-300 overflow-x-auto max-h-72">
                  <pre>{JSON.stringify(SAMPLE_DEMO_DATA, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Compliance & Demo Notice Footer */}
          <div className="p-4 sm:p-5 bg-[#060608] border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-zinc-500 text-left">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>
                Demonstração baseada em registros públicos oficiais da Receita Federal. O CNPJ Premium não emite certidões negativas nem atribui scores automáticos de crédito.
              </span>
            </div>
            <button
              type="button"
              onClick={() => void onSelect(SAMPLE_DEMO_DATA.rawCnpj)}
              disabled={isLoading}
              className="text-xs text-zinc-300 hover:text-white font-mono underline underline-offset-4 shrink-0 transition cursor-pointer"
            >
              Testar esta empresa agora →
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
