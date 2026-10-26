import React, { useState, useEffect } from 'react';
import { formatCNPJ } from '../utils/formatters';
import { Clock, Star, Trash2, X, ExternalLink } from 'lucide-react';

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
  refreshTrigger?: number;
}

export default function HistoricoFavoritos({
  onSelect,
  isLoading,
  refreshTrigger = 0,
}: HistoricoFavoritosProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');

  const loadData = () => {
    try {
      const historyCached = localStorage.getItem('premium_cnpj_history');
      if (historyCached) {
        try {
          const parsed = JSON.parse(historyCached);
          setHistory(Array.isArray(parsed) ? parsed : []);
        } catch {
          localStorage.removeItem('premium_cnpj_history');
          setHistory([]);
        }
      } else {
        setHistory([]);
      }

      const favsCached = localStorage.getItem('premium_cnpj_favorites');
      if (favsCached) {
        try {
          const parsed = JSON.parse(favsCached);
          setFavorites(Array.isArray(parsed) ? parsed : []);
        } catch {
          localStorage.removeItem('premium_cnpj_favorites');
          setFavorites([]);
        }
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
    e.stopPropagation();
    try {
      const favsCached = localStorage.getItem('premium_cnpj_favorites');
      if (favsCached) {
        let favsList: FavoriteItem[] = JSON.parse(favsCached);
        favsList = favsList.filter((item) => item.cnpj !== cnpjToRemove);
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
        historyList = historyList.filter((item) => item.cnpj !== cnpjToRemove);
        localStorage.setItem('premium_cnpj_history', JSON.stringify(historyList));
        setHistory(historyList);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (history.length === 0 && favorites.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-5xl mx-auto space-y-4 text-left animate-fade-in" id="local-history-favorites-section">
      {/* Header with tabs */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 min-h-11 px-4 py-2 text-xs md:text-sm font-semibold transition relative cursor-pointer ${
              activeTab === 'history' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Clock className={`w-4 h-4 ${activeTab === 'history' ? 'text-marsala-300' : 'text-zinc-500'}`} />
            <span>Histórico Recente</span>
            <span className="px-1.5 py-0.2 rounded-full bg-zinc-900 border border-white/[0.06] text-[10px] font-mono">
              {history.length}
            </span>
            {activeTab === 'history' && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-marsala-accent"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 min-h-11 px-4 py-2 text-xs md:text-sm font-semibold transition relative cursor-pointer ${
              activeTab === 'favorites' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Star className={`w-4 h-4 ${activeTab === 'favorites' ? 'text-amber-400' : 'text-zinc-500'}`} />
            <span>Favoritos</span>
            <span className="px-1.5 py-0.2 rounded-full bg-zinc-900 border border-white/[0.06] text-[10px] font-mono">
              {favorites.length}
            </span>
            {activeTab === 'favorites' && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-marsala-accent"></span>
            )}
          </button>
        </div>

        {activeTab === 'history' && history.length > 0 && (
          <button
            type="button"
            onClick={handleClearHistory}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-500 hover:text-red-400 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-950/40 hover:bg-red-950/20 transition active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Histórico</span>
          </button>
        )}
      </div>

      {/* Tab Panels */}
      {activeTab === 'history' ? (
        history.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs font-mono">
            Nenhuma consulta realizada recentemente no dispositivo.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {history.map((item) => (
              <div
                key={item?.cnpj || Math.random().toString()}
                className="group p-4 bg-[#08080a] hover:bg-[#0c0c10] border border-white/[0.06] hover:border-white/[0.14] rounded-xl transition duration-200 flex items-start justify-between gap-3 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => item?.cnpj && !isLoading && onSelect(item.cnpj)}
                  disabled={isLoading}
                  className="min-h-11 min-w-0 flex-1 space-y-1.5 overflow-hidden text-left rounded-lg cursor-pointer"
                  aria-label={`Consultar novamente ${item?.razaoSocial || item?.cnpj}`}
                >
                  <h4 className="text-xs font-bold text-zinc-200 group-hover:text-white transition truncate leading-snug">
                    {item?.razaoSocial || 'Sem Razão Social'}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                    <span className="text-zinc-300">{formatCNPJ(item?.cnpj)}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="truncate">{item?.cidade || 'Não informada'}/{item?.uf || 'UF'}</span>
                  </div>
                </button>

                <div className="flex items-center gap-1 shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={() => item?.cnpj && !isLoading && onSelect(item.cnpj)}
                    aria-label="Abrir consulta"
                    className="p-2 text-zinc-500 hover:text-white transition rounded-md"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => item?.cnpj && handleRemoveHistoryItem(item.cnpj, e)}
                    className="p-2 text-zinc-600 hover:text-red-400 transition rounded-md"
                    aria-label={`Remover ${item?.razaoSocial || item?.cnpj} do histórico`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        favorites.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs font-mono">
            Nenhum CNPJ favoritado ainda. Salve empresas pelo botão de estrela na página de resultados.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favorites.map((item) => (
              <div
                key={item?.cnpj || Math.random().toString()}
                className="group p-4 bg-[#08080a] hover:bg-[#0c0c10] border border-white/[0.06] hover:border-amber-500/30 rounded-xl transition duration-200 flex items-start justify-between gap-3 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => item?.cnpj && !isLoading && onSelect(item.cnpj)}
                  disabled={isLoading}
                  className="min-h-11 min-w-0 flex-1 space-y-1.5 overflow-hidden text-left rounded-lg cursor-pointer"
                  aria-label={`Consultar novamente ${item?.razaoSocial || item?.cnpj}`}
                >
                  <h4 className="text-xs font-bold text-zinc-200 group-hover:text-white transition truncate leading-snug">
                    {item?.razaoSocial || 'Sem Razão Social'}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                    <span className="text-amber-300/90">{formatCNPJ(item?.cnpj)}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="truncate">{item?.cidade || 'Não informada'}/{item?.uf || 'UF'}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={(e) => item?.cnpj && handleRemoveFavorite(item.cnpj, e)}
                  className="p-2 text-amber-400 hover:text-red-400 transition rounded-md"
                  aria-label={`Remover ${item?.razaoSocial || item?.cnpj} dos favoritos`}
                >
                  <Star className="w-4 h-4 fill-amber-400" />
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </section>
  );
}
