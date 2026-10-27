import React from 'react';
import { ArrowDown, ArrowUpRight, ShieldCheck, Users, Search } from 'lucide-react';

interface Props {
  onSelectCnpj?: (cnpj: string) => void;
}

export default function ArikServicesSection({ onSelectCnpj }: Props) {
  const services = [
    {
      index: '01',
      title: 'CONSULTA DIRETA',
      desc: 'Acesso imediato aos dados cadastrais públicos da Receita Federal sem intermediários, sem captchas e com resposta em milissegundos.',
      action: 'Explorar Dados',
      href: '#demonstracao',
      icon: Search,
    },
    {
      index: '02',
      title: 'QUADRO SOCIETÁRIO (QSA)',
      desc: 'Mapeamento completo de sócios e administradores, vínculos corporativos, participações e histórico de qualificações de cada integrante.',
      action: 'Ver Estrutura',
      href: '#demonstracao',
      icon: Users,
    },
    {
      index: '03',
      title: 'DIAGNÓSTICO & SAÚDE',
      desc: 'Análise de tempo de atividade, diversificação do mix de CNAEs e consistência de endereço para respaldar contratações e parcerias.',
      action: 'Auditar Empresa',
      href: '#demonstracao',
      icon: ShieldCheck,
    },
  ];

  const partners = [
    'RECEITA FEDERAL',
    'BANCO CENTRAL',
    'SIMPLES NACIONAL',
    'JUNTAS COMERCIAIS',
    'PORTAL GOV.BR',
  ];

  return (
    <section className="py-12 sm:py-20 space-y-16" id="recursos">
      {/* 1. Down Arrow Indicator (Arik signature) */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <a
          href="#servicos"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141415] border border-[#2d2b28] hover:border-[#dac5a7]/60 text-xs font-sans uppercase tracking-wider text-[#9e9b97] hover:text-[#dac5a7] transition duration-200"
        >
          <ArrowDown className="w-3.5 h-3.5 text-[#dac5a7]" />
          <span>RECURSOS CADASTRIAIS</span>
        </a>
      </div>

      {/* 2. Official Ecosystem Logos Strip (Arik monochrome strip) */}
      <div className="w-full max-w-6xl mx-auto px-4">
        <p className="text-center text-[10px] font-mono uppercase tracking-widest text-[#6a6660] mb-8">
          ECOSSISTEMA INTEGRADO DE FONTES PÚBLICAS BRASILEIRAS
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 md:gap-16 opacity-60 hover:opacity-90 transition-opacity">
          {partners.map((partner) => (
            <div
              key={partner}
              className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-[#9e9b97] hover:text-[#dac5a7] transition-colors"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Three-Column Cards Grid (Arik Screenshot 2 signature) */}
      <div className="w-full max-w-6xl mx-auto px-4" id="servicos">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.index}
                className="group relative rounded-2xl bg-[#141415] border border-[#2d2b28] hover:border-[#dac5a7]/50 p-7 sm:p-8 flex flex-col justify-between space-y-8 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
              >
                <div className="space-y-5">
                  {/* Index in Champagne Font */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm sm:text-base font-semibold text-[#dac5a7] tracking-wider">
                      {item.index}
                    </span>
                    <div className="p-2 rounded-xl bg-[#181819] border border-[#2d2b28] text-[#9e9b97] group-hover:text-[#dac5a7] transition">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-sans font-bold tracking-tight text-white group-hover:text-[#dac5a7] transition">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#9e9b97] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-4 border-t border-[#232220]">
                  <a
                    href={item.href}
                    className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#dac5a7] hover:text-[#edd6b6] transition group-hover:translate-x-1 duration-200"
                  >
                    <span>{item.action}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
