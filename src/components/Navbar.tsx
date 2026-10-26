import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onHomeClick: () => void;
  hasResult?: boolean;
}

export default function Navbar({ onHomeClick, hasResult }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Recursos', href: '#recursos' },
    { label: 'Demonstração', href: '#demonstracao' },
    { label: 'Diferenciais', href: '#diferenciais' },
    { label: 'Tecnologia', href: '#tecnologia' },
    { label: 'Metodologia', href: '#metodologia' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (hasResult) {
      onHomeClick();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#030304]/90 backdrop-blur-md">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand: CNPJ Premium | Leonardo LABS */}
        <div className="flex items-center gap-7">
          <button
            onClick={onHomeClick}
            aria-label="CNPJ Premium — Página Inicial"
            className="flex items-center gap-3.5 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-marsala-500 rounded-lg py-1 px-1 transition"
          >
            {/* Architectural Monogram Emblem */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-950 border border-white/[0.12] group-hover:border-marsala-500/60 transition shadow-inner">
              <span className="font-mono text-xs font-black tracking-tight text-white group-hover:text-marsala-300 transition-colors">
                CP
              </span>
              <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-marsala-accent"></span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-sans font-extrabold text-base tracking-tight leading-none group-hover:text-zinc-100 transition">
                  CNPJ
                </span>
                <span className="text-zinc-400 font-sans font-medium text-base tracking-tight leading-none">
                  Premium
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mt-1 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-marsala-accent"></span>
                Leonardo LABS
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 pl-5 border-l border-white/[0.06]" aria-label="Navegação Principal">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white rounded-md hover:bg-white/[0.04] transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Status Indicator & Fast Action */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#08080b] border border-white/[0.06] text-[11px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="tracking-wide">2026.RFB // SISTEMA OPERACIONAL</span>
          </div>

          {hasResult && (
            <button
              onClick={onHomeClick}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition active:scale-95 shadow-sm cursor-pointer"
            >
              Nova Consulta
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          {hasResult && (
            <button
              onClick={onHomeClick}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-zinc-950 rounded-md"
            >
              Nova busca
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
            className="p-2 min-h-11 min-w-11 flex items-center justify-center rounded-lg border border-white/[0.1] text-zinc-300 hover:text-white hover:bg-white/[0.05] transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Architectural Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/[0.08] bg-[#07070a] px-6 py-6 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 px-2 pb-3 border-b border-white/[0.06] text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Base Oficial da Receita Federal Sincronizada</span>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="flex items-center justify-between min-h-11 px-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-600" />
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>LEONARDO LABS // BLACK PRECISION</span>
            <a href="/privacidade.html" className="underline hover:text-zinc-300">Privacidade</a>
          </div>
        </div>
      )}
    </header>
  );
}
