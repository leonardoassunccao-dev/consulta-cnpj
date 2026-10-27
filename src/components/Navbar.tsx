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
    { label: 'O Processo', href: '#processo' },
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
    <header className="sticky top-3 sm:top-5 z-50 w-full px-4 flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-4xl flex flex-col items-center">
        {/* Floating Capsule Bar (Arik signature) */}
        <div className="w-full sm:w-auto flex items-center justify-between gap-3 sm:gap-7 px-4 py-2 sm:px-5 sm:py-2 rounded-full bg-[#141415]/90 border border-[#2d2b28] backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          
          {/* Brand */}
          <button
            onClick={onHomeClick}
            aria-label="CNPJ Premium — Início"
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
          >
            <span className="font-sans font-extrabold text-sm tracking-tight text-white group-hover:text-[#dac5a7] transition">
              cnpj premium<span className="text-[#dac5a7]">.</span>
            </span>
            <span className="hidden md:inline-block text-[9px] font-mono tracking-widest text-[#9e9b97] uppercase pl-2 border-l border-[#2d2b28]">
              Leonardo LABS
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1 md:gap-2" aria-label="Navegação">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="px-2.5 py-1 text-[11px] font-sans font-medium uppercase tracking-wider text-[#9e9b97] hover:text-[#dac5a7] transition-colors rounded-full hover:bg-white/[0.03]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Button (Arik solid champagne button) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (hasResult) onHomeClick();
                else {
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement | null;
                  input?.focus();
                }
              }}
              className="px-4 py-1.5 sm:px-5 sm:py-1.5 rounded-full bg-[#dac5a7] hover:bg-[#edd6b6] text-[#0c0c0d] font-sans font-bold text-[11px] sm:text-xs tracking-wider uppercase transition shadow-sm cursor-pointer active:scale-95 shrink-0"
            >
              {hasResult ? 'Nova Consulta' : 'Consultar'}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              className="sm:hidden p-1.5 rounded-full text-[#9e9b97] hover:text-white hover:bg-white/[0.05] transition"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-2 w-full max-w-sm rounded-2xl bg-[#141415]/95 border border-[#2d2b28] p-4 space-y-2 shadow-2xl backdrop-blur-lg animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="flex items-center justify-between py-2 px-3 text-xs font-sans uppercase tracking-wider text-[#9e9b97] hover:text-[#dac5a7] rounded-lg hover:bg-white/[0.04] transition"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6a6660]" />
              </a>
            ))}
            <div className="pt-2 border-t border-[#2d2b28] flex items-center justify-between text-[10px] font-mono text-[#6a6660]">
              <span>LEONARDO LABS</span>
              <a href="/privacidade.html" className="underline hover:text-[#dac5a7]">Privacidade</a>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
