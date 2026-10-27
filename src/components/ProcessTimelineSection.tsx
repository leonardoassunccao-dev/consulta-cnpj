import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function ProcessTimelineSection() {
  const steps = [
    {
      index: '01',
      tag: 'ENTRADA // MÓDULO 11',
      duration: 'IMEDIATO',
      title: 'VALIDAÇÃO MATEMÁTICA',
      desc: 'O CNPJ é higienizado em tempo real durante a digitação e submetido ao algoritmo oficial do Módulo 11 da Receita Federal diretamente no navegador.',
      bullets: [
        'Validação instantânea dos dois dígitos verificadores (DV)',
        'Tratamento automático de colagem com ou sem pontuação',
        'Prevenção de consultas desnecessárias ou inválidas à rede',
      ],
      align: 'right', // displays on right side on desktop
    },
    {
      index: '02',
      tag: 'CONEXÃO // RECEITA FEDERAL',
      duration: '< 400MS',
      title: 'REQUISIÇÃO À BASE PÚBLICA',
      desc: 'Comunicação criptografada e direta com os servidores oficiais de dados abertos empresariais do Brasil, com redundância de servidores.',
      bullets: [
        'Consulta direta e sem resolução de captchas manuais',
        'Protocolo de alta disponibilidade com tempo de resposta recorde',
        'Criptografia TLS 1.3 ponta a ponta sem intermediários',
      ],
      align: 'left', // displays on left side on desktop
    },
    {
      index: '03',
      tag: 'ESTRUTURAÇÃO // 5 CAMADAS',
      duration: 'TEMPO REAL',
      title: 'ORGANIZAÇÃO POR DOMÍNIO',
      desc: 'O payload bruto em JSON é processado e estruturado em cinco eixos analíticos para permitir leitura rápida e foco no que interessa.',
      bullets: [
        'Identificação: Razão Social, Nome Fantasia, Situação RFB e Capital',
        'Atividades: CNAE Principal e catálogo completo de CNAEs Secundários',
        'Contatos & Endereço: Telefones, E-mail oficial e localização com mapa',
        'Quadro Societário: Mapeamento de sócios, administradores e cargos',
      ],
      align: 'right',
    },
    {
      index: '04',
      tag: 'DOSSIÊ // EXPORTAÇÃO EXECUTIVA',
      duration: 'OFFLINE',
      title: 'RELATÓRIO PDF DIAGRAMADO',
      desc: 'Gere instantaneamente um documento executivo formal com a síntese cadastral e a análise de maturidade da empresa, pronto para anexar em pareceres.',
      bullets: [
        'Layout editorial de alto contraste e legibilidade impecável',
        'Renderização 100% no cliente sem envio de dados para servidores',
        'Carimbo com data e hora oficial da consulta para conformidade',
      ],
      align: 'left',
    },
  ];

  return (
    <section className="py-16 sm:py-28 relative" id="processo">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20">
        
        {/* Section Header (Arik Signature Heading) */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141415] border border-[#2d2b28] text-[10px] font-mono tracking-widest text-[#dac5a7] uppercase">
            <span>O PROCESSO</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-light tracking-tight text-white leading-tight">
            A Consulta <br />
            <span className="font-serif italic font-normal text-[#dac5a7]">
              em 4 passos
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#9e9b97] leading-relaxed">
            Nossa arquitetura garante dados cadastrais íntegros e auditáveis, sem retenção indevida de dados confidenciais.
          </p>

          <div className="pt-2 flex justify-center">
            <div className="w-8 h-8 rounded-full bg-[#141415] border border-[#2d2b28] flex items-center justify-center text-[#dac5a7]">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Central Connecting Timeline */}
        <div className="relative">
          {/* Vertical Technical Line (Desktop: center, Mobile: left-6) */}
          <div
            className="absolute top-0 bottom-0 left-6 lg:left-1/2 lg:-translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[#3d3b37] to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Steps List */}
          <div className="space-y-12 sm:space-y-16">
            {steps.map((step) => {
              const isRight = step.align === 'right';
              return (
                <div
                  key={step.index}
                  className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between"
                >
                  {/* Central Node Badge */}
                  <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#0c0c0d] border border-[#dac5a7] text-[#dac5a7] font-mono text-xs font-bold shadow-[0_0_15px_rgba(218,197,167,0.2)]">
                    {step.index}
                  </div>

                  {/* Desktop Left Slot (Empty if right-aligned) */}
                  <div className={`hidden lg:block w-[45%] ${isRight ? 'invisible' : ''}`}>
                    {!isRight && <StepCard step={step} />}
                  </div>

                  {/* Desktop Right Slot (Empty if left-aligned) */}
                  <div className={`w-full pl-14 lg:pl-0 lg:w-[45%] ${!isRight ? 'lg:hidden' : ''}`}>
                    <StepCard step={step} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

function StepCard({ step }: { step: any }) {
  return (
    <article className="group relative rounded-2xl bg-[#141415] border border-[#2d2b28] hover:border-[#dac5a7]/50 p-6 sm:p-8 space-y-4 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider">
        <span className="text-[#dac5a7] font-semibold">{step.tag}</span>
        <span className="px-2.5 py-0.5 rounded-full bg-[#1e1e20] text-[#a8a49c] border border-[#2d2b28]">
          {step.duration}
        </span>
      </div>

      {/* Step Title */}
      <h3 className="text-lg sm:text-xl font-sans font-bold text-white tracking-tight group-hover:text-[#dac5a7] transition">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm text-[#9e9b97] leading-relaxed">
        {step.desc}
      </p>

      {/* Bullets */}
      <ul className="pt-2 space-y-1.5 border-t border-[#232220] text-xs text-[#a8a49c]">
        {step.bullets.map((bullet: string, idx: number) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-[#dac5a7] select-none">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
