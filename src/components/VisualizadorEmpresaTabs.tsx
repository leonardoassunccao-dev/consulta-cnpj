import React, { useState, useEffect } from 'react';
import {
  formatCNPJ,
  formatCurrency,
  formatDate,
  formatCEP,
  formatPhone,
  formatFallback,
} from '../utils/formatters';
import InscricoesEstaduais from './InscricoesEstaduais';
import JsonExplorer from './JsonExplorer';
import Metricas from './Metricas';

interface VisualizadorEmpresaTabsProps {
  data: any;
  onFavoriteToggle: () => void;
}

export default function VisualizadorEmpresaTabs({ data, onFavoriteToggle }: VisualizadorEmpresaTabsProps) {
  const [activeTab, setActiveTab] = useState<'geral' | 'endereco' | 'atividades' | 'contatos' | 'socios' | 'inscricoes' | 'json'>('geral');
  const [isFavorited, setIsFavorited] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const estab = data?.estabelecimento || {};
  const porte = data?.porte || {};
  const natureza = data?.natureza_juridica || {};
  const atividadePrincipal = estab?.atividade_principal || {};
  const atividadesSecundarias = Array.isArray(estab?.atividades_secundarias) ? estab.atividades_secundarias : [];
  const cidade = estab?.cidade || {};
  const estado = estab?.estado || {};

  const cleanCnpj = (estab.cnpj || data.cnpj || '').replace(/\D/g, '');

  // Check if current is favorited
  useEffect(() => {
    try {
      const favsCached = localStorage.getItem('premium_cnpj_favorites');
      if (favsCached) {
        const favsList = JSON.parse(favsCached);
        if (Array.isArray(favsList)) {
          setIsFavorited(favsList.some((item: any) => item.cnpj === cleanCnpj));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [cleanCnpj, data]);

  const handleToggleFav = () => {
    try {
      const favsCached = localStorage.getItem('premium_cnpj_favorites');
      let favsList = favsCached ? JSON.parse(favsCached) : [];
      if (!Array.isArray(favsList)) favsList = [];

      const exists = favsList.some((item: any) => item.cnpj === cleanCnpj);
      if (exists) {
        favsList = favsList.filter((item: any) => item.cnpj !== cleanCnpj);
        setIsFavorited(false);
      } else {
        favsList.unshift({
          razaoSocial: data.razao_social || 'Não informada',
          cnpj: cleanCnpj,
          cidade: cidade.nome || 'Não informada',
          uf: estado.sigla || estab.uf || '',
          favoritadoEm: new Date().toISOString()
        });
        setIsFavorited(true);
      }
      localStorage.setItem('premium_cnpj_favorites', JSON.stringify(favsList));
      onFavoriteToggle(); // Notify parent of the change
    } catch (e) {
      console.error(e);
    }
  };

  // Helper for dynamic copying
  const copyToClipboard = async (textToCopy: string, label: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyFeedback(label);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  if (!data) return null;

  // Formatting variables
  const cnpjFormated = formatCNPJ(estab.cnpj || data.cnpj);
  const razaoSocial = formatFallback(data.razao_social);
  const nomeFantasia = formatFallback(estab.nome_fantasia, 'Sem nome fantasia');
  const situacaoCadastral = formatFallback(estab.situacao_cadastral, 'Desconhecida').toUpperCase();
  const dataAbertura = formatDate(estab.data_inicio_atividade);
  const porteDesc = formatFallback(porte.descricao);
  const capitalSocial = formatCurrency(data.capital_social);
  
  const atividadePrincipalDesc = atividadePrincipal.id 
    ? `${atividadePrincipal.id} - ${atividadePrincipal.descricao}` 
    : 'Não informado';

  // Contacts
  const telefoneStr = formatPhone(estab.ddd1, estab.telefone1);
  const emailStr = formatFallback(estab.email);
  const siteStr = formatFallback(estab.site || estab.situacao_especial || 'Não informado');

  // Address
  const cepStr = formatCEP(estab.cep);
  const logradouro = estab.logradouro || '';
  const tipoLogradouro = estab.tipo_logradouro ? `${estab.tipo_logradouro} ` : '';
  const numero = estab.numero ? `, Nº ${estab.numero}` : '';
  const complemento = estab.complemento ? ` - ${estab.complemento}` : '';
  const bairro = estab.bairro ? ` - Bairro ${estab.bairro}` : '';
  const cidadeNome = cidade.nome || 'Não informado';
  const estadoSigla = estado.sigla || '';
  const enderecoCompleto = `${tipoLogradouro}${logradouro}${numero}${complemento}${bairro}, ${cidadeNome} - ${estadoSigla}, CEP ${cepStr}`;

  // Age Calculator
  let tempoExistencia = 'Não identificado';
  let ageYears = 0;
  if (estab.data_inicio_atividade) {
    const openingDate = new Date(estab.data_inicio_atividade);
    if (!isNaN(openingDate.getTime())) {
      const today = new Date();
      ageYears = today.getFullYear() - openingDate.getFullYear();
      const m = today.getMonth() - openingDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < openingDate.getDate())) {
        ageYears--;
      }
      tempoExistencia = ageYears === 1 ? '1 ano' : `${ageYears} anos`;
    }
  }

  // Calculate Cadastral Score (0 to 100)
  let scoreValue = 0;
  const scoreReasons: { text: string; success: boolean }[] = [];

  // Rules:
  // - CNPJ ativo: +30
  if (situacaoCadastral === 'ATIVA') {
    scoreValue += 30;
    scoreReasons.push({ text: 'CNPJ Ativo (+30 pts)', success: true });
  } else {
    scoreReasons.push({ text: `CNPJ em situação: ${situacaoCadastral}`, success: false });
  }

  // - Mais de 5 anos: +20
  if (ageYears >= 5) {
    scoreValue += 20;
    scoreReasons.push({ text: `Empresa aberta há mais de 5 anos (${tempoExistencia}) (+20 pts)`, success: true });
  } else if (ageYears > 0) {
    scoreReasons.push({ text: `Empresa recente (${tempoExistencia})`, success: false });
  } else {
    scoreReasons.push({ text: 'Data de abertura não qualificada', success: false });
  }

  // - Telefone ou E-mail: +15
  const hasContact = !!(estab.telefone1 || estab.email);
  if (hasContact) {
    scoreValue += 15;
    scoreReasons.push({ text: 'Possui dados de contato (Telefone ou E-mail) (+15 pts)', success: true });
  } else {
    scoreReasons.push({ text: 'Sem telefone ou e-mail cadastrado', success: false });
  }

  // - Endereço completo: +15
  const hasFullAddress = !!(estab.logradouro && estab.numero && estab.bairro && estab.cep);
  if (hasFullAddress) {
    scoreValue += 15;
    scoreReasons.push({ text: 'Endereço cadastral completo (+15 pts)', success: true });
  } else {
    scoreReasons.push({ text: 'Endereço incompleto na base pública', success: false });
  }

  // - CNAE principal: +10
  if (atividadePrincipal.id) {
    scoreValue += 10;
    scoreReasons.push({ text: 'Possui classificação CNAE principal (+10 pts)', success: true });
  } else {
    scoreReasons.push({ text: 'Sem classificação CNAE principal', success: false });
  }

  // - Capital social: +10
  const hasCapital = !!(data.capital_social && parseFloat(data.capital_social) > 0);
  if (hasCapital) {
    scoreValue += 10;
    scoreReasons.push({ text: 'Possui Capital Social declarado (+10 pts)', success: true });
  } else {
    scoreReasons.push({ text: 'Capital Social zerado ou não informado', success: false });
  }

  // Interpretive summary text
  const interpretSummary = () => {
    let base = `Empresa ativa desde ${estab.data_inicio_atividade ? dataAbertura.slice(6) : 'sua data de fundação'}, `;
    if (cidadeNome && estadoSigla) {
      base += `localizada em ${cidadeNome}/${estadoSigla}, `;
    }
    if (atividadePrincipal.descricao) {
      base += `com atuação principal no segmento de ${atividadePrincipal.descricao.toLowerCase()}. `;
    } else {
      base += 'com atividades de registro econômico não declaradas de forma direta. ';
    }

    if (situacaoCadastral === 'ATIVA' && hasFullAddress && hasContact) {
      base += `O cadastro possui informações cadastrais essenciais preenchidas (como endereço completo e meios de contato) e demonstra alta consistência para uma análise cadastral preliminar.`;
    } else if (situacaoCadastral === 'ATIVA') {
      base += `Embora a empresa esteja ativa e registrada, nota-se a falta de algumas informações acessórias (contatos atualizados ou campos adicionais de endereço). Recomenda-se verificação complementar básica.`;
    } else {
      base += `A empresa encontra-se sob situação cadastral de "${situacaoCadastral}". Atenção em transações operacionais é recomendada, devendo-se examinar justificativas cadastrais adicionais.`;
    }
    return base;
  };

  // Status badges colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVA':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-900/60';
      case 'INAPTA':
        return 'bg-red-950/80 text-red-400 border-red-800/60';
      case 'SUSPENSA':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/60';
      case 'BAIXADA':
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
      default:
        return 'bg-zinc-900 text-zinc-400 border-zinc-800';
    }
  };

  // Prepare simple markdown summaries for copying
  const handleCopyDadosFiscais = () => {
    const txt = `RAZÃO SOCIAL: ${razaoSocial}
CNPJ: ${cnpjFormated}
SITUAÇÃO: ${situacaoCadastral}
ABERTURA: ${dataAbertura} (${tempoExistencia})
CNAE PRINCIPAL: ${atividadePrincipalDesc}
CAPITAL SOCIAL: ${capitalSocial}`;
    copyToClipboard(txt, 'Dados Fiscais');
  };

  const handleCopyCadastroCompleto = () => {
    const txt = `--- CADASTRO SIMPLIFICADO CNPJ PREMIUM ---
Razão Social: ${razaoSocial}
Nome Fantasia: ${nomeFantasia}
CNPJ: ${cnpjFormated}
Situação Cadastral: ${situacaoCadastral}
Abertura: ${dataAbertura} (${tempoExistencia})
Porte: ${porteDesc}
Capital Social: ${capitalSocial}

--- ENDEREÇO ---
Endereço: ${enderecoCompleto}

--- CONTATOS ---
Telefone: ${telefoneStr}
E-mail: ${emailStr}
Site: ${siteStr}

--- ATIVIDADE ---
CNAE Principal: ${atividadePrincipalDesc}
`;
    copyToClipboard(txt, 'Cadastro Completo');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Upper header block: Enterprise Title + Favorite action */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">RESULTADO DA CONSULTA</span>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
              {razaoSocial}
            </h2>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-sans uppercase tracking-wider border ${getStatusColor(situacaoCadastral)}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${situacaoCadastral === 'ATIVA' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`}></span>
              {situacaoCadastral}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            {cnpjFormated} {nomeFantasia !== 'Não informado' ? `• ${nomeFantasia}` : ''}
          </p>
        </div>

        {/* Favorite toggle action */}
        <button
          onClick={handleToggleFav}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition active:scale-95 ${
            isFavorited
              ? 'bg-amber-950/30 border-amber-800 text-amber-400'
              : 'bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white'
          }`}
        >
          <svg className={`w-4 h-4 ${isFavorited ? 'fill-current' : 'none'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.583 1.847l-3.971 2.887a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.887a1 1 0 00-1.176 0l-3.971 2.887c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.05 10.14c-.778-.595-.378-1.847.583-1.847h4.907a1 1 0 00.95-.69l1.519-4.674z" />
          </svg>
          {isFavorited ? 'Remover Favorito' : 'Adicionar Favorito'}
        </button>
      </div>

      {/* Copy notification banner */}
      {copyFeedback && (
        <div className="bg-emerald-950/80 border border-emerald-900/80 text-emerald-300 text-xs px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in shadow-lg">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Copiado com sucesso: <strong>{copyFeedback}</strong></span>
        </div>
      )}

      {/* Interactive premium tab headers */}
      <div className="flex overflow-x-auto pb-1 border-b border-zinc-900 scrollbar-none gap-1">
        {[
          { id: 'geral', label: 'Visão Geral', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
          { id: 'endereco', label: 'Endereço', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
          { id: 'atividades', label: 'Atividades', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
          { id: 'contatos', label: 'Contatos', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
          { id: 'socios', label: 'Sócios', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          { id: 'inscricoes', label: 'Inscrições Estaduais', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { id: 'json', label: 'JSON Completo', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold rounded-xl border transition-all flex-shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-zinc-100 border-zinc-200 text-zinc-950 font-bold shadow-lg shadow-zinc-100/5'
                : 'bg-zinc-950/20 border-zinc-900/60 text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content wrapper */}
      <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden min-h-[350px]">
        
        {/* TAB 1: VISÃO GERAL */}
        {activeTab === 'geral' && (
          <div className="space-y-6 animate-fade-in">
            {/* Bento Grid: Score and Interpretive Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Score Cadastral Panel (left) */}
              <div className="lg:col-span-5 p-5 bg-zinc-900/30 border border-zinc-900 rounded-2xl space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Score Cadastral Simples
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                    Métrica algorítmica de preenchimento e integridade do registro. Não representa score de crédito.
                  </p>
                </div>

                {/* Score visualization circle & bar */}
                <div className="flex items-center gap-5 my-2">
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-zinc-900 bg-black/40">
                    <span className="text-xl font-extrabold text-white font-mono">{scoreValue}</span>
                    <span className="text-[9px] text-zinc-500 absolute bottom-3">/ 100</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-xs font-bold text-zinc-300">Classificação</span>
                    <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          scoreValue >= 80 ? 'bg-emerald-500' : scoreValue >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${scoreValue}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-zinc-400 block font-medium">
                      {scoreValue >= 80 ? 'Excelente Consistência' : scoreValue >= 50 ? 'Consistência Média' : 'Consistência Baixa'}
                    </span>
                  </div>
                </div>

                {/* Checklist reasons */}
                <div className="space-y-1.5 border-t border-zinc-900/80 pt-3">
                  {scoreReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <span>{reason.success ? '✅' : '⚠️'}</span>
                      <span className={reason.success ? 'text-zinc-300' : 'text-zinc-500'}>{reason.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo Interpretativo Panel (right) */}
              <div className="lg:col-span-7 p-5 bg-zinc-900/30 border border-zinc-900 rounded-2xl space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resumo Inteligente Interpretativo
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                    Leitura analítica dinâmica gerada a partir dos dados do cadastro público.
                  </p>
                </div>

                <div className="p-4 bg-black/30 border border-zinc-900 rounded-xl leading-relaxed">
                  <p className="text-sm text-zinc-300 font-sans italic">
                    "{interpretSummary()}"
                  </p>
                </div>

                {/* Micro claim warning */}
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  *Esta leitura possui caráter puramente informacional e interpretativo com base em dados de domínio público e não constitui qualquer conselho jurídico ou avaliação de risco comercial.
                </p>
              </div>

            </div>

            {/* Quick action buttons for copy-pasting */}
            <div className="p-5 bg-zinc-900/20 border border-zinc-900 rounded-2xl space-y-3.5">
              <h4 className="text-xs uppercase tracking-widest font-mono text-zinc-500 font-bold">Ações Rápidas de Cópia de Dados</h4>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => copyToClipboard(razaoSocial, 'Razão Social')}
                  className="px-3.5 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-350 hover:text-white rounded-xl text-xs font-semibold transition active:scale-95 flex items-center gap-1.5"
                >
                  📄 Razão Social
                </button>
                <button
                  onClick={() => copyToClipboard(cnpjFormated, 'CNPJ Formatado')}
                  className="px-3.5 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-350 hover:text-white rounded-xl text-xs font-semibold transition active:scale-95 flex items-center gap-1.5"
                >
                  🔢 CNPJ Formatado
                </button>
                <button
                  onClick={() => copyToClipboard(enderecoCompleto, 'Endereço Completo')}
                  className="px-3.5 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-350 hover:text-white rounded-xl text-xs font-semibold transition active:scale-95 flex items-center gap-1.5"
                >
                  📍 Endereço Completo
                </button>
                <button
                  onClick={() => copyToClipboard(telefoneStr, 'Telefone')}
                  className="px-3.5 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-350 hover:text-white rounded-xl text-xs font-semibold transition active:scale-95 flex items-center gap-1.5"
                >
                  📞 Telefone
                </button>
                <button
                  onClick={() => copyToClipboard(emailStr, 'E-mail')}
                  className="px-3.5 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-350 hover:text-white rounded-xl text-xs font-semibold transition active:scale-95 flex items-center gap-1.5"
                >
                  ✉️ E-mail
                </button>
                <button
                  onClick={handleCopyDadosFiscais}
                  className="px-3.5 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-350 hover:text-white rounded-xl text-xs font-semibold transition active:scale-95 flex items-center gap-1.5"
                >
                  ⚖️ Dados Fiscais
                </button>
                <button
                  onClick={handleCopyCadastroCompleto}
                  className="px-3.5 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-350 hover:text-white rounded-xl text-xs font-semibold transition active:scale-95 flex items-center gap-1.5"
                >
                  📦 Ficha Cadastral Simplificada
                </button>
              </div>
            </div>

            {/* Quick statistics layout cards */}
            <Metricas data={data} />

            {/* Enterprise general information grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
              <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Abertura</span>
                <p className="text-zinc-200 font-semibold font-mono">{dataAbertura}</p>
              </div>
              <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Tempo de Existência</span>
                <p className="text-zinc-200 font-semibold font-sans">{tempoExistencia}</p>
              </div>
              <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Porte</span>
                <p className="text-zinc-200 font-semibold font-sans">{porteDesc}</p>
              </div>
              <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Capital Social</span>
                <p className="text-zinc-200 font-semibold font-mono">{capitalSocial}</p>
              </div>
              <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Natureza Jurídica</span>
                <p className="text-zinc-200 font-sans line-clamp-1">{formatFallback(natureza.descricao)}</p>
              </div>
              <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">UF Sede</span>
                <p className="text-zinc-200 font-semibold font-mono">{estadoSigla || estab.uf || 'Não informado'}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ENDEREÇO */}
        {activeTab === 'endereco' && (
          <div className="space-y-6 animate-fade-in text-sm text-left">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="text-base font-bold text-white">Localização Física e Logradouro</h3>
              <button
                onClick={() => copyToClipboard(enderecoCompleto, 'Endereço Completo')}
                className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                📋 Copiar Endereço Completo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="p-4.5 bg-zinc-900/25 border border-zinc-900 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Logradouro</span>
                <p className="text-zinc-200 font-medium font-sans">{formatFallback(estab.logradouro)}</p>
              </div>
              <div className="p-4.5 bg-zinc-900/25 border border-zinc-900 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Número</span>
                <p className="text-zinc-200 font-medium font-sans">{formatFallback(estab.numero)}</p>
              </div>
              <div className="p-4.5 bg-zinc-900/25 border border-zinc-900 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Bairro</span>
                <p className="text-zinc-200 font-medium font-sans">{formatFallback(estab.bairro)}</p>
              </div>
              <div className="p-4.5 bg-zinc-900/25 border border-zinc-900 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Cidade</span>
                <p className="text-zinc-200 font-medium font-sans">{formatFallback(cidade.nome)}</p>
              </div>
              <div className="p-4.5 bg-zinc-900/25 border border-zinc-900 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Estado (UF)</span>
                <p className="text-zinc-200 font-medium font-mono">{formatFallback(estado.sigla || estab.uf)}</p>
              </div>
              <div className="p-4.5 bg-zinc-900/25 border border-zinc-900 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">CEP</span>
                <p className="text-zinc-200 font-medium font-mono">{cepStr}</p>
              </div>
              <div className="p-4.5 bg-zinc-900/25 border border-zinc-900 rounded-xl space-y-1 md:col-span-2 lg:col-span-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Complemento</span>
                <p className="text-zinc-200 font-medium font-sans">{formatFallback(estab.complemento, 'Sem complemento registrado')}</p>
              </div>
            </div>

            <div className="p-4 bg-zinc-900/20 border border-zinc-900/80 rounded-xl space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Visualização Integrada</span>
              <p className="text-zinc-300 italic">
                "{enderecoCompleto}"
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: ATIVIDADES */}
        {activeTab === 'atividades' && (
          <div className="space-y-6 animate-fade-in text-sm text-left">
            <div className="border-b border-zinc-900 pb-3">
              <h3 className="text-base font-bold text-white">Classificação Fiscal e Atividades Econômicas</h3>
            </div>

            {/* CNAE Principal */}
            <div className="p-5 bg-zinc-900/25 border border-zinc-900 rounded-2xl space-y-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-widest font-bold bg-zinc-100 text-zinc-950 rounded">
                CNAE Principal
              </span>
              <div className="space-y-1">
                <p className="text-xs font-mono text-zinc-500">CÓDIGO: {formatFallback(atividadePrincipal.id)}</p>
                <p className="text-base font-bold text-zinc-200 leading-snug">
                  {formatFallback(atividadePrincipal.descricao)}
                </p>
              </div>
            </div>

            {/* CNAE Secundários */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">Atividades Econômicas Secundárias ({atividadesSecundarias.length})</h4>
              
              {atividadesSecundarias.length === 0 ? (
                <p className="text-zinc-600 text-xs italic py-2">Não há CNAEs secundários informados.</p>
              ) : (
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {atividadesSecundarias.map((sec: any, index: number) => (
                    <div key={index} className="p-4 bg-zinc-900/15 border border-zinc-900/80 rounded-xl space-y-1 hover:border-zinc-800 transition">
                      <p className="text-[10px] font-mono text-zinc-500">CÓDIGO: {sec.id || 'N/A'}</p>
                      <p className="text-xs font-semibold text-zinc-300 leading-relaxed">
                        {sec.descricao || 'Descrição não informada'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CONTATOS */}
        {activeTab === 'contatos' && (
          <div className="space-y-6 animate-fade-in text-sm text-left">
            <div className="border-b border-zinc-900 pb-3">
              <h3 className="text-base font-bold text-white">Informações de Contato e Comunicação</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Telefone card */}
              <div className="p-4.5 bg-zinc-900/25 border border-zinc-900 rounded-2xl flex flex-col justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Telefone</span>
                  <p className="text-base font-bold text-zinc-200 font-mono tracking-wider">{telefoneStr}</p>
                </div>
                {telefoneStr !== 'Não informado' && (
                  <button
                    onClick={() => copyToClipboard(telefoneStr, 'Telefone')}
                    className="self-start text-[11px] font-mono uppercase text-zinc-400 hover:text-white flex items-center gap-1 mt-2"
                  >
                    📋 Copiar
                  </button>
                )}
              </div>

              {/* Email card */}
              <div className="p-4.5 bg-zinc-900/25 border border-zinc-900 rounded-2xl flex flex-col justify-between gap-4 md:col-span-2 lg:col-span-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">E-mail Cadastral</span>
                  <p className="text-sm font-bold text-zinc-200 truncate" title={emailStr}>{emailStr}</p>
                </div>
                {emailStr !== 'Não informado' && (
                  <button
                    onClick={() => copyToClipboard(emailStr, 'E-mail')}
                    className="self-start text-[11px] font-mono uppercase text-zinc-400 hover:text-white flex items-center gap-1 mt-2"
                  >
                    📋 Copiar
                  </button>
                )}
              </div>

              {/* Website / Situação Especial */}
              <div className="p-4.5 bg-zinc-900/25 border border-zinc-900 rounded-2xl flex flex-col justify-between gap-4 md:col-span-3 lg:col-span-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Website / Situação Especial</span>
                  <p className="text-sm font-bold text-zinc-200 truncate" title={siteStr}>{siteStr}</p>
                </div>
                {siteStr !== 'Não informado' && (
                  <button
                    onClick={() => copyToClipboard(siteStr, 'Website')}
                    className="self-start text-[11px] font-mono uppercase text-zinc-400 hover:text-white flex items-center gap-1 mt-2"
                  >
                    📋 Copiar
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: SÓCIOS */}
        {activeTab === 'socios' && (
          <div className="space-y-6 animate-fade-in text-sm text-left">
            <div className="border-b border-zinc-900 pb-3">
              <h3 className="text-base font-bold text-white">Quadro de Sócios e Administradores (QSA)</h3>
            </div>

            {Array.isArray(data?.socios) && data.socios.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.socios.map((socio: any, i: number) => (
                  <div key={i} className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <p className="font-semibold text-zinc-200 capitalize truncate" title={socio.nome}>{socio.nome?.toLowerCase() || 'Não informado'}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        Tipo: {socio.tipo_socio || 'Não informado'}
                      </p>
                    </div>
                    <span className="flex-shrink-0 px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-[10px] rounded-lg text-zinc-400 font-medium">
                      {socio.qualificacao_socio?.descricao || 'Sócio'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-600 font-mono text-xs">
                Nenhum sócio ou administrador encontrado na base cadastral pública para esta empresa.
              </div>
            )}
          </div>
        )}

        {/* TAB 6: INSCRIÇÕES ESTADUAIS */}
        {activeTab === 'inscricoes' && (
          <div className="animate-fade-in">
            <InscricoesEstaduais data={data} />
          </div>
        )}

        {/* TAB 7: JSON COMPLETO */}
        {activeTab === 'json' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="text-left">
                <h3 className="text-base font-bold text-white">Payload Completo da Receita Federal</h3>
                <p className="text-xs text-zinc-500">Exibição de todos os dados retornados pela consulta da API CNPJ.ws.</p>
              </div>
              <button
                onClick={() => copyToClipboard(JSON.stringify(data, null, 2), 'JSON Completo')}
                className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                📋 Copiar JSON Inteiro
              </button>
            </div>

            <JsonExplorer data={data} />
          </div>
        )}

      </div>
    </div>
  );
}
