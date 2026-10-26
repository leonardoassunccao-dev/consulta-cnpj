import React from 'react';
import { Terminal, Database, HardDrive, FileSpreadsheet } from 'lucide-react';

export default function TechArchitectureSection() {
  const steps = [
    {
      step: '01',
      title: 'Normalização & Formatação',
      description: 'Higienização de pontuações e sanitização de entradas. Aplicação de máscara dinâmica progressiva.',
      tech: 'cnpj.ts (Client)',
    },
    {
      step: '02',
      title: 'Validação Módulo 11',
      description: 'Cálculo estrito dos dois dígitos verificadores diretamente no navegador antes de qualquer requisição de rede.',
      tech: 'Algoritmo RFB',
    },
    {
      step: '03',
      title: 'Consulta Base Pública RFB',
      description: 'Comunicação assíncrona com timeout preventivo de 15 segundos e tratamento estruturado de respostas HTTP.',
      tech: 'fetch API + AbortController',
    },
    {
      step: '04',
      title: 'Camadas Contextuais',
      description: 'Organização dos dados em módulos: Cadastro Fiscal, CNAEs, Sócios, Endereço e Payload JSON bruto.',
      tech: 'React 19 + TypeScript',
    },
    {
      step: '05',
      title: 'Persistência Local e Privada',
      description: 'Histórico e favoritos armazenados estritamente na memória local do navegador (localStorage), sem rastreamento.',
      tech: 'localStorage API',
    },
  ];

  return (
    <section className="py-14 md:py-24 border-t border-white/[0.06]" id="tecnologia" aria-labelledby="tech-title">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-12 text-left">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-marsala-accent"></span>
            <span>ENGENHARIA E CONFIABILIDADE</span>
          </div>
          <h2 id="tech-title" className="text-3xl sm:text-4xl md:text-5xl font-sans font-black text-white tracking-tight">
            Arquitetura técnica transparente.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Sem promessas abstratas. Conheça exatamente como o CNPJ Premium processa, valida e apresenta as informações públicas da Receita Federal.
          </p>
        </div>

        {/* Technical Pipeline Flow Diagram */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#060608] p-6 sm:p-8 space-y-6 shadow-xl crosshair-corner">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-marsala-300" />
              <span className="font-bold tracking-wider">PIPELINE DE EXECUÇÃO DE CONSULTA</span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase">Fluxo Determinístico // Zero Cookies</span>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {steps.map((item, idx) => (
              <div
                key={item.step}
                className="relative p-4 rounded-xl bg-[#030304] border border-white/[0.05] flex flex-col justify-between space-y-3 hover:border-marsala-500/30 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-marsala-300">
                    {item.step}
                  </span>
                  {idx < steps.length - 1 && (
                    <span className="hidden md:inline font-mono text-xs text-zinc-700">→</span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white font-sans">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.04]">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                    {item.tech}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Pillars of Verifiable Trust */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="p-6 rounded-2xl bg-[#060608] border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 text-zinc-200">
              <Database className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono">1. Base Pública RFB</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Os dados refletem os registros oficiais de Pessoas Jurídicas abertos da Receita Federal do Brasil. Atualizações seguem o ciclo oficial de consolidação dos arquivos governamentais.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#060608] border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 text-zinc-200">
              <HardDrive className="w-4 h-4 text-marsala-300" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono">2. Armazenamento no Cliente</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              O CNPJ Premium não mantém um banco de dados dos termos ou empresas que você pesquisa. Seu histórico de até 10 empresas e sua lista de favoritos residem unicamente no seu próprio navegador.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#060608] border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 text-zinc-200">
              <FileSpreadsheet className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono">3. Integridade do Payload</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Disponibilizamos a árvore JSON integral recebida da fonte para que analistas técnicos e desenvolvedores possam auditar os dados brutos sem qualquer filtragem ou distorção.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
