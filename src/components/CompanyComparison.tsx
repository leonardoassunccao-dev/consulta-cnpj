import React, { useMemo, useState } from 'react';
import { fetchCnpj } from '../services/cnpjApi';
import { companyView, activityDuration } from '../utils/companyAnalysis';
import { formatCNPJ, formatCurrency } from '../utils/formatters';
import { isValidCnpj, normalizeCnpj } from '../utils/cnpj';
import { GitCompare, Plus, X } from 'lucide-react';

export default function CompanyComparison({ currentData }: { currentData: any }) {
  const [input, setInput] = useState('');
  const [items, setItems] = useState<any[]>([currentData]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const views = useMemo(() => items.map(companyView), [items]);

  async function add() {
    const cnpj = normalizeCnpj(input);
    if (!isValidCnpj(cnpj)) return setError('Digite um CNPJ válido para comparar.');
    if (items.length >= 3) return setError('A comparação permite até 3 empresas simultâneas.');
    if (views.some((item) => item.cnpj === cnpj)) return setError('Esta empresa já está na comparação.');

    setLoading(true);
    setError('');
    const response = await fetchCnpj(cnpj);
    setLoading(false);

    if (!response.success) {
      return setError(response.error ?? 'Não foi possível consultar esta empresa.');
    }

    setItems((previous) => [...previous, response.data]);
    setInput('');
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#070709] p-6 space-y-6" aria-labelledby="comparison-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            <GitCompare className="w-3.5 h-3.5 text-marsala-300" />
            <span>COMPARAÇÃO CADASTRAL</span>
          </div>
          <h2 id="comparison-title" className="text-lg font-bold text-white tracking-tight mt-1">
            Comparar até 3 empresas
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            Leitura paralela dos dados públicos declarados na Receita Federal.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            inputMode="numeric"
            placeholder="CNPJ para comparar"
            className="min-h-11 w-48 rounded-xl border border-white/[0.1] bg-zinc-950 px-3 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-marsala-500/70"
          />
          <button
            type="button"
            onClick={add}
            disabled={loading || items.length >= 3}
            className="min-h-11 rounded-xl bg-white px-4 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{loading ? 'Consultando…' : 'Adicionar'}</span>
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs font-mono text-red-400 px-1">
          {error}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-[680px] w-full text-left text-xs">
          <thead className="border-b border-white/[0.08] text-zinc-400 font-mono">
            <tr>
              <th className="p-3 w-40 uppercase tracking-wider text-[10px]">Indicador</th>
              {views.map((view) => (
                <th key={view.cnpj} className="p-3 font-semibold text-white">
                  <div className="text-sm">{view.legalName}</div>
                  <div className="font-mono text-xs text-marsala-300 font-normal mt-0.5">
                    {formatCNPJ(view.cnpj)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-zinc-300">
            {[
              ['Situação Cadastral', (view: any) => view.status],
              ['Tempo de Atividade', (view: any) => activityDuration(view.openedAt)],
              ['Município / UF', (view: any) => `${view.city}/${view.state}`],
              ['Porte Declarado', (view: any) => view.size],
              ['Capital Social', (view: any) => formatCurrency(view.capital)],
              ['CNAE Principal', (view: any) => view.primaryActivity?.description ?? 'Não disponível na fonte pública'],
              ['Quadro Societário', (view: any) => (view.partnersCount === null ? 'Não informado' : `${view.partnersCount} membro(s)`)],
            ].map(([label, get]: any) => (
              <tr key={label} className="hover:bg-white/[0.02]">
                <th className="p-3 font-mono text-[11px] text-zinc-400 font-medium">{label}</th>
                {views.map((view) => (
                  <td key={view.cnpj} className="p-3 align-top font-sans">
                    {get(view)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length > 1 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.04]">
          {items.slice(1).map((item, index) => (
            <button
              type="button"
              key={companyView(item).cnpj}
              onClick={() => setItems((previous) => previous.filter((_, i) => i !== index + 1))}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-950 border border-white/[0.06] hover:border-red-900/50 text-[11px] text-zinc-400 hover:text-red-300 transition"
            >
              <X className="w-3 h-3" />
              <span>Remover {companyView(item).legalName}</span>
            </button>
          ))}
        </div>
      )}

      <p className="text-[11px] text-zinc-500 font-mono">
        Diferenças exibidas conforme registros oficiais. A ponderação e a decisão comercial permanecem sob responsabilidade humana.
      </p>
    </section>
  );
}
