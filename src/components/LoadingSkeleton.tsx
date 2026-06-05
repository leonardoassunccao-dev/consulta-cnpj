import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse text-gray-300">
      {/* Metrics Row Skeleton - Match Metricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-zinc-900/50 backdrop-blur-md rim-zinc border border-zinc-800/80 rounded-xl p-4 space-y-2">
            <div className="h-3 w-1/2 bg-zinc-800 rounded"></div>
            <div className="h-6 w-3/4 bg-zinc-800 rounded"></div>
          </div>
        ))}
      </div>

      {/* Main General Card Skeleton - Match ResumoEmpresa Header */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-48 bg-zinc-800 rounded-lg"></div>
              <div className="h-6 w-20 bg-zinc-800 rounded-full"></div>
            </div>
            <div className="h-4 w-64 bg-zinc-800 rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-zinc-800 rounded-lg"></div>
            <div className="h-10 w-28 bg-zinc-800 rounded-lg"></div>
          </div>
        </div>

        <hr className="border-zinc-800" />

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-zinc-800 rounded"></div>
              <div className="h-5 w-4/5 bg-zinc-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Inscricoes Estaduais / CNAE Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 space-y-4">
          <div className="h-5 w-44 bg-zinc-800 rounded"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <div className="h-4 w-28 bg-zinc-800 rounded"></div>
                <div className="h-4 w-16 bg-zinc-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 space-y-4">
          <div className="h-5 w-52 bg-zinc-800 rounded"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center py-2">
                <div className="h-6 w-12 bg-zinc-800 rounded"></div>
                <div className="h-4 w-4/5 bg-zinc-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
