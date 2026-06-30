import React, { useState, useEffect } from 'react';
import { formatCNPJ } from '../utils/formatters';

interface HistoryItem {
  razaoSocial: string;
  cnpj: string;
  cidade: string;
  uf: string;
  consultadoEm: string;
}

interface FavoriteItem {
  razaoSocial: string;
  cnpj: string;
  cidade: string;
  uf: string;
  favoritadoEm: string;
}

interface HistoricoFavoritosProps {
  onSelect: (cnpj: string) => void;
  isLoading: boolean;
  refreshTrigger?: number; // To trigger reload from outside when state changes
}

export default function HistoricoFavoritos({ onSelect, isLoading, refreshTrigger = 0 }: HistoricoFavoritosProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');

  const loadData = () => {
    try {
      const historyCached = localStorage.getItem('premium_cnpj_history');
      if (historyCached) {
        setHistory(JSON.parse(historyCached));
      } else {
        setHistory([]);
      }

      const favsCached = localStorage.getItem('premium_cnpj_favorites');
      if (favsCached) {
        setFavorites(JSON.parse(favsCached));
      } else {
        setFavorites([]);
      }
    } catch (e) {
      console.error('Erro ao ler localStorage:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const handleClearHistory = () => {
    try {
      localStorage.removeItem('premium_cnpj_history');
      setHistory([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveFavorite = (cnpjToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering parent onClick
    try {
      const favsCached = localStorage.getItem('premium_cnpj_favorites');
      if (favsCached) {
        let favsList: FavoriteItem[] = JSON.parse(favsCached);
        favsList = favsList.filter(item => item.cnpj !== cnpjToRemove);
        localStorage.setItem('premium_cnpj_favorites', JSON.stringify(favsList));
        setFavorites(favsList);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveHistoryItem = (cnpjToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const historyCached = localStorage.getItem('premium_cnpj_history');
      if (historyCached) {
        let historyList: HistoryItem[] = JSON.parse(historyCached);
        historyList = historyList.filter(item => item.cnpj !== cnpjToRemove);
        localStorage.setItem('premium_cnpj_history', JSON.stringify(historyList));
        setHistory(historyList);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // If both list are empty, show nothing or simple visual hint
  if (history.length === 0 && favorites.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 text-left animate-fade-in" id="local-history-favorites-section">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold transition relative ${
              activeTab === 'history' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            📋 Histórico Recente ({history.length})
            {activeTab === 'history' && (
              <span className="absolute bottom-[-11px] left-0 right-0 h-0.5 bg-zinc-350"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold transition relative ${
              activeTab === 'favorites' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            ⭐️ Favoritados ({favorites.length})
            {activeTab === 'favorites' && (
              <span className="absolute bottom-[-11px] left-0 right-0 h-0.5 bg-zinc-350"></span>
            )}
          </button>
        </div>

        {activeTab === 'history' && history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-red-500/80 hover:text-red-400 font-semibold px-2.5 py-1 bg-red-950/10 hover:bg-red-950/20 border border-red-950/30 rounded-lg transition"
          >
            Limpar Histórico
          </button>
        )}
      </div>

      {activeTab === 'history' ? (
        history.length === 0 ? (
          <div className="py-8 text-center text-zinc-600 text-xs font-mono">
            Nenhuma consulta realizada recentemente.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {history.map((item) => (
              <div
                key={item.cnpj}
                onClick={() => !isLoading && onSelect(item.cnpj)}
                className="group p-4 bg-zinc-950/40 hover:bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 rounded-xl cursor-pointer transition flex items-start justify-between gap-4"
              >
                <div className="space-y-1 overflow-hidden">
                  <h4 className="text-xs font-semibold text-zinc-300 group-hover:text-white transition truncate capitalize leading-snug">
                    {item.razaoSocial.toLowerCase()}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                    <span>{formatCNPJ(item.cnpj)}</span>
                    <span>•</span>
                    <span className="truncate">{item.cidade}/{item.uf}</span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => handleRemoveHistoryItem(item.cnpj, e)}
                  className="text-zinc-600 hover:text-zinc-400 p-1 hover:bg-zinc-900 rounded-md transition"
                  title="Remover do histórico"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        favorites.length === 0 ? (
          <div className="py-8 text-center text-zinc-600 text-xs font-mono">
            Nenhum CNPJ favoritado ainda. Favorito um CNPJ no painel de resultados!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favorites.map((item) => (
              <div
                key={item.cnpj}
                onClick={() => !isLoading && onSelect(item.cnpj)}
                className="group p-4 bg-zinc-950/40 hover:bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 rounded-xl cursor-pointer transition flex items-start justify-between gap-4"
              >
                <div className="space-y-1 overflow-hidden">
                  <h4 className="text-xs font-semibold text-zinc-300 group-hover:text-white transition truncate capitalize leading-snug">
                    {item.razaoSocial.toLowerCase()}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                    <span>{formatCNPJ(item.cnpj)}</span>
                    <span>•</span>
                    <span className="truncate">{item.cidade}/{item.uf}</span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => handleRemoveFavorite(item.cnpj, e)}
                  className="text-amber-500/80 hover:text-red-400 p-1 hover:bg-zinc-900 rounded-md transition"
                  title="Remover dos favoritos"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
