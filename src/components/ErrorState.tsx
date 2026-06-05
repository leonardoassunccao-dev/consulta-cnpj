import React from 'react';

interface ErrorStateProps {
  error: string;
  errorType: 'INVALID_CNPJ' | 'NOT_FOUND' | 'TIMEOUT' | 'UNKNOWN' | 'CONNECTION' | 'API_ERROR' | null;
  onClear: () => void;
}

export default function ErrorState({ error, errorType, onClear }: ErrorStateProps) {
  // Translate the error reason into practical suggestions
  const getHelperMessage = () => {
    switch (errorType) {
      case 'INVALID_CNPJ':
        return 'Certifique-se de preencher o CNPJ exatamente com os 14 caracteres numéricos corretos. Evite usar zeros adicionais ou caracteres inválidos.';
      case 'NOT_FOUND':
        return 'Este CNPJ não pôde ser encontrado na base da Receita Federal. Certifique-se de que o número digitado está correto e que a empresa está devidamente cadastrada.';
      case 'TIMEOUT':
        return 'A API da Receita Federal (publica.cnpj.ws) está instável ou demorou demais para responder. Por favor, aguarde alguns instantes e faça uma nova tentativa.';
      case 'CONNECTION':
        return 'Falha local de rede ou o servidor central de CNPJ está temporariamente indisponível. Verifique sua conexão com a internet e atualize a página.';
      case 'API_ERROR':
        return 'Houve uma recusa ou falha da infraestrutura parceira de busca da Receita Federal. A API externa pode estar em manutenção temporária.';
      default:
        return 'Ocorreu um erro inesperado ao executar a transação. Se o problema persistir, por favor tente novamente mais tarde.';
    }
  };

  const getTitle = () => {
    switch (errorType) {
      case 'INVALID_CNPJ':
        return 'CNPJ Inválido';
      case 'NOT_FOUND':
        return 'CNPJ Não Encontrado';
      case 'TIMEOUT':
        return 'Tempo Limite Excedido';
      case 'CONNECTION':
        return 'Falha de Conexão de Rede';
      case 'API_ERROR':
        return 'Instabilidade na API Externa';
      default:
        return 'Erro Inesperado';
    }
  };

  return (
    <div className="bg-red-950/20 backdrop-blur-md border border-red-900/40 rounded-2xl p-6 md:p-8 space-y-6 max-w-2xl mx-auto text-left relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-800/10 rounded-full blur-2xl"></div>

      <div className="flex items-start gap-4">
        {/* Warning Icon (SVG) */}
        <div className="flex-shrink-0 bg-red-900/40 text-red-400 p-3 rounded-xl border border-red-800/50">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="space-y-1.5 flex-1">
          <span className="text-xs font-mono text-red-400/80 uppercase tracking-widest">{errorType || 'UNKNOWN'}</span>
          <h3 className="text-lg font-sans font-medium text-red-200 tracking-tight">{getTitle()}</h3>
          <p className="text-zinc-300 text-sm md:text-base leading-relaxed">{error}</p>
        </div>
      </div>

      <hr className="border-red-950/50" />

      <div className="space-y-4">
        <h4 className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">Como resolver:</h4>
        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">{getHelperMessage()}</p>

        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onClear}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs md:text-sm font-medium rounded-lg transition-all border border-zinc-700 active:scale-95"
          >
            Limpar e Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
