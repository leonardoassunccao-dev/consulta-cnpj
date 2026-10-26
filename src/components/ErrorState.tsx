import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  errorType: 'INVALID_CNPJ' | 'NOT_FOUND' | 'TIMEOUT' | 'UNKNOWN' | 'CONNECTION' | 'API_ERROR' | null;
  onClear: () => void;
}

export default function ErrorState({ error, errorType, onClear }: ErrorStateProps) {
  const getHelperMessage = () => {
    switch (errorType) {
      case 'INVALID_CNPJ':
        return 'Certifique-se de preencher o CNPJ com os 14 caracteres numéricos corretos. Números com dígitos verificadores inválidos são rejeitados antes do envio.';
      case 'NOT_FOUND':
        return 'Este CNPJ não foi localizado na base pública da Receita Federal. Verifique se os números foram digitados corretamente ou se trata-se de um registro recente.';
      case 'TIMEOUT':
        return 'A resposta da base pública de dados demorou mais de 15 segundos para responder. Aguarde alguns instantes e faça uma nova tentativa.';
      case 'CONNECTION':
        return 'Falha local de conexão com a rede ou instabilidade temporária. Verifique sua conexão e tente novamente.';
      case 'API_ERROR':
        return 'A infraestrutura externa parceira da Receita Federal retornou uma instabilidade temporária. Tente novamente em instantes.';
      default:
        return 'Ocorreu um erro inesperado durante a consulta. Se o problema persistir, por favor tente novamente mais tarde.';
    }
  };

  const getTitle = () => {
    switch (errorType) {
      case 'INVALID_CNPJ':
        return 'CNPJ Inválido';
      case 'NOT_FOUND':
        return 'CNPJ Não Localizado';
      case 'TIMEOUT':
        return 'Tempo Limite Excedido';
      case 'CONNECTION':
        return 'Falha de Conexão';
      case 'API_ERROR':
        return 'Instabilidade na Base Externa';
      default:
        return 'Falha na Consulta';
    }
  };

  return (
    <div className="bg-[#09080a] border border-red-900/50 rounded-2xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto text-left shadow-2xl animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/40 text-red-400 shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-1 flex-1">
          <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">
            {errorType || 'ERRO DE REQUISIÇÃO'}
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">{getTitle()}</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">{error}</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.05] space-y-2">
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
          Recomendação de ação:
        </h4>
        <p className="text-xs text-zinc-400 leading-relaxed">{getHelperMessage()}</p>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onClear}
          className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs sm:text-sm hover:bg-zinc-200 transition active:scale-95 flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Busca</span>
        </button>
      </div>
    </div>
  );
}
