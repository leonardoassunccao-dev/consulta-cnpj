import React, { useMemo } from 'react';
import { analyzeJson, JsonStats } from '../utils/jsonHelpers';

interface MetricasProps {
  data: any;
}

export default function Metricas({ data }: MetricasProps) {
  const stats: JsonStats | null = useMemo(() => {
    if (!data) return null;
    return analyzeJson(data);
  }, [data]);

  if (!stats) return null;

  const cards = [
    {
      title: 'Campos Recebidos',
      value: stats.totalFields,
      desc: 'Chaves e valores no JSON',
      icon: (
        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      ),
    },
    {
      title: 'Campos Preenchidos',
      value: stats.filledFields,
      desc: 'Dados válidos disponíveis',
      icon: (
        <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Campos Vazios',
      value: stats.emptyFields,
      desc: 'Valores nulos ou ausentes',
      icon: (
        <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Quantidade de Objetos',
      value: stats.numberOfObjects,
      desc: 'Estruturas de dicionários',
      icon: (
        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Quantidade de Listas',
      value: stats.numberOfLists,
      desc: 'Arrays de dados aninhados',
      icon: (
        <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      title: 'Tamanho total JSON',
      value: `${stats.sizeInKB} KB`,
      desc: 'Consumo do payload bruto',
      icon: (
        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-left">
        <h3 className="text-xs uppercase font-extrabold text-zinc-500 tracking-widest font-mono">
          Análise e Estatísticas do CNPJ
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="group relative bg-zinc-950/40 backdrop-blur-md border border-zinc-900 rounded-2xl p-4.5 space-y-2 text-left hover:border-zinc-850 hover:bg-zinc-950/65 transition"
          >
            <div className="flex justify-between items-center text-zinc-400">
              <span className="text-[10px] font-bold tracking-wider font-mono uppercase truncate max-w-[130px]" title={card.title}>
                {card.title}
              </span>
              <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:bg-zinc-800 transition">
                {card.icon}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-xl md:text-2xl font-bold text-white tracking-tight font-sans">
                {card.value}
              </div>
              <p className="text-[10px] text-zinc-500 font-normal leading-tight">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
