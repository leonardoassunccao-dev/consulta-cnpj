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
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Brand: CNPJ Premium | Leonardo LABS */}
        <div className="flex items-center gap-6">
          <button
            onClick={onHomeClick}
            aria-label="CNPJ Premium — Página Inicial"
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-marsala-500 rounded py-1 transition"
          >
            {/* Architectural Monogram Emblem */}
            <div className="relative flex items-center justify-center w-7 h-7 rounded-md bg-zinc-950 border border-white/[0.12] group-hover:border-marsala-500/60 transition shadow-inner">
              <span className="font-mono text-[10px] font-black tracking-tight text-white group-hover:text-marsala-300 transition-colors">
                CP
              </span>
              <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-marsala-accent"></span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-white font-sans font-bold text-sm tracking-tight leading-none group-hover:text-zinc-100 transition">
                CNPJ <span className="text-zinc-400 font-normal">Premium</span>
              </span>
              <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase hidden xs:inline-flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-marsala-accent"></span>
                Leonardo LABS
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1 pl-4 border-l border-white/[0.08]" aria-label="Navegação Principal">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-white rounded hover:bg-white/[0.04] transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {hasResult && (
            <button
              onClick={onHomeClick}
              className="px-3 py-1 rounded-md text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition active:scale-95 shadow-sm cursor-pointer"
            >
              Nova Consulta
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
            className="sm:hidden p-1.5 rounded-md border border-white/[0.1] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-white/[0.08] bg-[#07070a] px-5 py-4 space-y-3 animate-fade-in">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="flex items-center justify-between py-2 text-sm font-medium text-zinc-300 hover:text-white transition"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600" />
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>LEONARDO LABS</span>
            <a href="/privacidade.html" className="underline hover:text-zinc-300">Privacidade</a>
          </div>
        </div>
      )}
    </header>
  );
}
