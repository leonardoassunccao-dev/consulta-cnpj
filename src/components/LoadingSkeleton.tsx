import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse text-zinc-400" aria-label="Carregando consulta...">
      {/* Top Banner Skeleton */}
      <div className="bg-[#08080b] border border-white/[0.08] rounded-2xl p-6 md:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 bg-zinc-900 rounded"></div>
            <div className="h-8 w-3/4 sm:w-1/2 bg-zinc-850 rounded-lg"></div>
            <div className="h-4 w-48 bg-zinc-900 rounded"></div>
          </div>
          <div className="h-10 w-32 bg-zinc-900 rounded-xl"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 pb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-28 bg-zinc-900/60 rounded-xl"></div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="bg-[#070709] border border-white/[0.08] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-zinc-950/70 border border-white/[0.04] space-y-2">
              <div className="h-3 w-20 bg-zinc-900 rounded"></div>
              <div className="h-6 w-28 bg-zinc-850 rounded"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-5 rounded-xl bg-zinc-950/60 border border-white/[0.04] space-y-3">
            <div className="h-4 w-40 bg-zinc-900 rounded"></div>
            <div className="h-16 w-full bg-zinc-900/50 rounded"></div>
          </div>
          <div className="p-5 rounded-xl bg-zinc-950/60 border border-white/[0.04] space-y-3">
            <div className="h-4 w-40 bg-zinc-900 rounded"></div>
            <div className="h-16 w-full bg-zinc-900/50 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
