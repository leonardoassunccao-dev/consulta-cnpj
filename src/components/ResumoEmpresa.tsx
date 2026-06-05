import React from 'react';
import {
  formatCNPJ,
  formatCurrency,
  formatDate,
  formatCEP,
  formatPhone,
  formatFallback,
} from '../utils/formatters';

interface ResumoEmpresaProps {
  data: any;
}

export default function ResumoEmpresa({ data }: ResumoEmpresaProps) {
  if (!data) return null;

  const estab = data.estabelecimento || {};
  const porte = data.porte || {};
  const natureza = data.natureza_juridica || {};
  const atividadePrincipal = estab.atividade_principal || {};
  const cidade = estab.cidade || {};
  const estado = estab.estado || {};

  // Formatted values helpers
  const cnpjFormated = formatCNPJ(estab.cnpj || data.cnpj);
  const razaoSocial = formatFallback(data.razao_social);
  const nomeFantasia = formatFallback(estab.nome_fantasia || 'Sem nome fantasia');
  const situacaoCadastral = formatFallback(estab.situacao_cadastral, 'Desconhecida').toUpperCase();
  const dataAbertura = formatDate(estab.data_inicio_atividade);
  const porteDesc = formatFallback(porte.descricao);
  const naturezaDesc = formatFallback(natureza.descricao);
  const capitalSocial = formatCurrency(data.capital_social);
  const atividadePrincipalDesc = atividadePrincipal.id 
    ? `${atividadePrincipal.id} - ${atividadePrincipal.descricao}` 
    : 'Não informado';

  // Contact info
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

  // Get status color badge
  const getSituacaoBadge = (status: string) => {
    switch (status) {
      case 'ATIVA':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold font-sans tracking-wide uppercase rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Ativa
          </span>
        );
      case 'INAPTA':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold font-sans tracking-wide uppercase rounded-full bg-red-950/80 text-red-400 border border-red-800/60 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            Inapta
          </span>
        );
      case 'SUSPENSA':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold font-sans tracking-wide uppercase rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/60 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Suspensa
          </span>
        );
      case 'BAIXADA':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold font-sans tracking-wide uppercase rounded-full bg-zinc-800/90 text-zinc-400 border border-zinc-700 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            Baixada
          </span>
        );
      case 'NULA':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold font-sans tracking-wide uppercase rounded-full bg-purple-950/80 text-purple-400 border border-purple-800/60 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            Nula
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold font-sans tracking-wide uppercase rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
            {status || 'Desconhecida'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Principal Card: Razaosocial & Summary indicators */}
      <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-900/90 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-zinc-100/[0.01] rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6" id="card-principal-resumo">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl md:text-2xl font-semibold font-sans text-white tracking-tight lead-tight">
                {razaoSocial}
              </h2>
              {getSituacaoBadge(situacaoCadastral)}
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">CNPJ:</span>
                <span className="font-mono text-zinc-300">{cnpjFormated}</span>
              </span>
              <span className="hidden md:inline text-zinc-700">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Nome Fantasia:</span>
                <span className="text-zinc-300">{nomeFantasia}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:self-center">
            <div className="px-4 py-2 bg-zinc-900/80 border border-zinc-800/80 rounded-xl text-center min-w-[100px]">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Abertura</div>
              <div className="text-sm font-semibold text-zinc-200 mt-1 font-mono">{dataAbertura}</div>
            </div>
            <div className="px-4 py-2 bg-zinc-900/80 border border-zinc-800/80 rounded-xl text-center min-w-[110px]">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Capital Social</div>
              <div className="text-sm font-semibold text-zinc-200 mt-1">{capitalSocial}</div>
            </div>
          </div>
        </div>

        <hr className="border-zinc-900/90" />

        {/* Informações Estruturais Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-left">
          
          {/* Natureza Jurídica */}
          <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl space-y-1.5 hover:border-zinc-800/50 transition">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Natureza Jurídica</span>
            <p className="font-sans font-medium text-zinc-200 line-clamp-2 md:line-clamp-3" title={naturezaDesc}>
              {naturezaDesc}
            </p>
          </div>

          {/* Porte da Empresa */}
          <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl space-y-1.5 hover:border-zinc-800/50 transition">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Porte</span>
            <p className="font-sans font-medium text-zinc-200">{porteDesc}</p>
          </div>

          {/* CNAE Principal */}
          <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl space-y-1.5 hover:border-zinc-800/50 transition md:col-span-2 lg:col-span-1">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">CNAE Principal</span>
            <p className="font-sans font-medium text-zinc-200 line-clamp-2" title={atividadePrincipalDesc}>
              {atividadePrincipalDesc}
            </p>
          </div>

          {/* Contato - Telefone, Email e Site */}
          <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl space-y-2.5 hover:border-zinc-800/50 transition">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Contato</span>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Telefone:</span>
                <span className="font-mono text-zinc-200 font-medium">{telefoneStr}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>E-mail:</span>
                <span className="text-zinc-200 font-medium break-all text-xs truncate max-w-[180px]" title={emailStr}>
                  {emailStr}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Website:</span>
                <span className="text-zinc-200 font-medium truncate max-w-[180px] text-xs" title={siteStr}>
                  {siteStr}
                </span>
              </div>
            </div>
          </div>

          {/* Localização compacta */}
          <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl space-y-2.5 hover:border-zinc-800/50 transition lg:col-span-2">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Localização Física</span>
            <div className="space-y-1 text-zinc-400">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1">
                <span>Cidade / Estado:</span>
                <span className="text-zinc-200 font-medium font-sans">
                  {cidadeNome} - {estadoSigla}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>CEP:</span>
                <span className="font-mono text-zinc-200 font-medium">{cepStr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Endereço Completo */}
        <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl space-y-1.5 text-left text-sm hover:border-zinc-800/50 transition">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">Endereço Completo</span>
          <p className="font-sans text-zinc-300 leading-relaxed font-normal">{enderecoCompleto}</p>
        </div>
      </div>
    </div>
  );
}
