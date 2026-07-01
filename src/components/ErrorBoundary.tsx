import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  private handleTryAgain = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleClearQuery = () => {
    try {
      localStorage.removeItem('premium_cnpj_last_result');
    } catch (e) {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
    // Simple way to reset state to home
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-left selection:bg-zinc-800 selection:text-white" id="error-boundary-view">
          <div className="w-full max-w-xl bg-gradient-to-b from-zinc-950/90 to-zinc-950/40 border border-red-900/30 rounded-3xl p-6 md:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.85)] relative overflow-hidden backdrop-blur-xl">
            {/* Ambient Red Glow */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="space-y-6 relative z-10">
              {/* Alert Icon */}
              <div className="w-12 h-12 rounded-2xl bg-red-950/50 border border-red-900/40 flex items-center justify-center text-red-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Error Messages */}
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight font-display">
                  Não foi possível exibir os dados deste CNPJ.
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                  Tente consultar novamente ou limpar a busca. Ocorreu uma inconsistência ao processar os dados cadastrais retornados pela Receita Federal.
                </p>
              </div>

              {/* Dev Logs placeholder if enabled */}
              {process.env.NODE_ENV !== 'production' && this.state.error && (
                <div className="p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800/60 text-[11px] font-mono text-zinc-500 overflow-auto max-h-32">
                  <p className="text-red-400 font-semibold mb-1">Stack Trace:</p>
                  {this.state.error.stack || this.state.error.message}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={this.handleTryAgain}
                  className="flex-1 px-4 py-3 text-xs font-bold bg-white text-zinc-950 rounded-xl hover:bg-zinc-200 active:scale-98 transition duration-150 text-center cursor-pointer"
                >
                  Tentar novamente
                </button>
                <button
                  onClick={this.handleClearQuery}
                  className="flex-1 px-4 py-3 text-xs font-bold bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl active:scale-98 transition duration-150 text-center cursor-pointer"
                >
                  Limpar consulta
                </button>
                <button
                  onClick={this.handleReload}
                  className="px-4 py-3 text-xs font-semibold bg-transparent hover:bg-zinc-900/30 border border-transparent hover:border-zinc-900 text-zinc-500 hover:text-zinc-400 rounded-xl transition duration-150 text-center cursor-pointer"
                >
                  Recarregar página
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
