import React, { useState, useEffect } from 'react';

// Color definitions based on data types
const getClassNameForValue = (val: any) => {
  if (val === null || val === undefined) return 'text-rose-450 italic font-mono';
  if (typeof val === 'boolean') return 'text-indigo-400 font-mono font-medium';
  if (typeof val === 'number') return 'text-sky-400 font-mono';
  return 'text-amber-300/90 font-sans';
};

const formatValuePreview = (val: any) => {
  if (val === null || val === undefined) return 'null';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'string') return `"${val}"`;
  return String(val);
};

interface NodeProps {
  name: string | number;
  value: any;
  depth: number;
  forceExpandAll: boolean | null;
}

const JsonExplorerNode: React.FC<NodeProps> = ({ name, value, depth, forceExpandAll }) => {
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);
  
  // Default to expanded for root (depth = 0), collapsed for deeper nodes
  const [isOpen, setIsOpen] = useState<boolean>(depth < 2);

  // Sync with global Expand/Collapse commands
  useEffect(() => {
    if (forceExpandAll !== null) {
      setIsOpen(forceExpandAll);
    }
  }, [forceExpandAll]);

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Humanize keys: change snake_case to capitalized Words
  const humanReadableName = typeof name === 'string' 
    ? name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) 
    : `Item ${name}`;

  if (!isObject) {
    return (
      <div className="flex flex-wrap items-baseline py-1.5 px-2 hover:bg-zinc-900/40 rounded-lg transition text-xs font-mono">
        <span className="text-zinc-400 font-sans font-medium mr-2">
          {humanReadableName}:
        </span>
        <span className={getClassNameForValue(value)}>
          {formatValuePreview(value)}
        </span>
      </div>
    );
  }

  const keys = Object.keys(value);
  const itemCount = isArray ? value.length : keys.length;
  const labelSuffix = isArray ? `[${itemCount} ${itemCount === 1 ? 'item' : 'itens'}]` : `{${itemCount} ${itemCount === 1 ? 'campo' : 'campos'}}`;

  return (
    <div className="text-left select-none text-xs">
      <div 
        onClick={toggleOpen}
        className="flex items-center gap-2 py-1.5 px-2 hover:bg-zinc-900/60 rounded-lg cursor-pointer transition font-mono group"
      >
        {/* Toggle Chevron */}
        <span className="text-zinc-500 group-hover:text-zinc-300 transition-transform duration-100 flex-shrink-0">
          <svg 
            className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>

        <span className="text-zinc-200 font-sans font-semibold">
          {humanReadableName}
        </span>
        <span className="text-zinc-500 font-mono text-[10px] bg-zinc-900 border border-zinc-800/60 px-1.5 py-0.5 rounded-md">
          {labelSuffix}
        </span>
      </div>

      {isOpen && (
        <div className="pl-4 ml-3 border-l border-zinc-900/80 space-y-0.5 mt-0.5">
          {isArray ? (
            value.map((item, index) => (
              <JsonExplorerNode 
                key={index} 
                name={index} 
                value={item} 
                depth={depth + 1} 
                forceExpandAll={forceExpandAll}
              />
            ))
          ) : (
            keys.map(key => (
              <JsonExplorerNode 
                key={key} 
                name={key} 
                value={value[key]} 
                depth={depth + 1} 
                forceExpandAll={forceExpandAll}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

interface JsonExplorerProps {
  data: any;
}

export default function JsonExplorer({ data }: JsonExplorerProps) {
  const [forceExpand, setForceExpand] = useState<boolean | null>(null);

  const handleExpandAll = () => {
    setForceExpand(true);
    // Reset parameter back to null shortly after to allow manual interactions again
    setTimeout(() => setForceExpand(null), 100);
  };

  const handleCollapseAll = () => {
    setForceExpand(false);
    setTimeout(() => setForceExpand(null), 100);
  };

  if (!data) return null;

  return (
    <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-900/90 rounded-2xl p-6 space-y-6 shadow-xl text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-100 tracking-tight flex items-center gap-2">
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Explorador Completo dos Dados
          </h2>
          <p className="text-xs text-zinc-500">
            Navegue interativamente por toda a árvore hierárquica retornada pela Receita Federal.
          </p>
        </div>

        {/* Global Expand/Collapse triggers */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleExpandAll}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 rounded-lg transition border border-zinc-850 active:scale-95"
          >
            Expandir Tudo
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 rounded-lg transition border border-zinc-850 active:scale-95"
          >
            Colapsar Tudo
          </button>
        </div>
      </div>

      <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl space-y-1.5 max-h-[500px] overflow-y-auto custom-scrollbar">
        {Object.keys(data).map(key => (
          <JsonExplorerNode 
            key={key} 
            name={key} 
            value={data[key]} 
            depth={0} 
            forceExpandAll={forceExpand}
          />
        ))}
      </div>
    </div>
  );
}
