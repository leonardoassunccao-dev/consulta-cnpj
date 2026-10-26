import React from 'react';
import {
  Zap,
  Layers,
  Sparkles,
  Lock,
  Code,
  FileDown,
  CheckCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function DifferentialsSection() {
  return (
    <section className="py-14 md:py-24 border-t border-white/[0.06]" id="diferenciais" aria-labelledby="differentials-title">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-12 text-left">
        
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-marsala-accent"></span>
            <span>IDENTIDADE VISUAL & ARQUITETURA</span>
          </div>
          <h2 id="differentials-title" className="text-3xl sm:text-4xl md:text-5xl font-sans font-black text-white tracking-tight">
            Por que o CNPJ Premium?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Eliminamos interfaces confusas, captchas e burocracia desnecessária. Desenvolvido para entregar máxima densidade de informação com clareza executiva e estética Black Precision.
          </p>
        </div>

        {/* Asymmetrical Architectural Dossier Composition */}
        <div className="space-y-4">
          
          {/* Row 1: Featured 60/40 Asymmetric Blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Block 1 (Large 7 columns): Consulta Rápida */}
            <article className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#060608] p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-white/[0.16] transition duration-300 crosshair-corner">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/[0.08] text-white">
                    <Zap className="w-5 h-5 text-zinc-200" />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                    [ DOSSIÊ 01 // VELOCIDADE ]
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Consulta rápida e sem burocracia.
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                    Sem login obrigatório, sem formulários longos e sem resolução de captchas. O CNPJ é formatado enquanto você digita, validado matematicamente no cliente e consultado em milissegundos.
                  </p>
                </div>
              </div>

              {/* Architectural Latency Micro-Widget */}
              <div className="rounded-xl border border-white/[0.06] bg-[#030304] p-4 font-mono text-xs space-y-2.5">
                <div className="flex items-center justify-between text-zinc-500 text-[10px] pb-1.5 border-b border-white/[0.04]">
                  <span>EXECUÇÃO DETERMINÍSTICA</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    DISPONIBILIDADE
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Validação Módulo 11 (Navegador)
                  </span>
                  <span className="text-zinc-500">&lt; 1ms</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    Requisição Direta Base RFB
                  </span>
                  <span className="text-zinc-400">Tempo de rede</span>
                </div>
              </div>
            </article>

            {/* Block 2 (5 columns): Resumo Inteligente */}
            <article className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#060608] p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-marsala-500/40 transition duration-300 crosshair-corner">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/[0.08] text-white">
                    <Sparkles className="w-5 h-5 text-marsala-300" />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                    [ DOSSIÊ 02 // CONTEXTO ]
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Resumo inteligente e contexto imediato.
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Transformamos registros crus da Receita Federal em sínteses executivas que destacam objetivamente pontos cadastrais para análise ágil de tomadores de decisão.
                  </p>
                </div>
              </div>

              {/* Micro-UI: Verification Checklist */}
              <div className="rounded-xl border border-white/[0.06] bg-[#030304] p-4 space-y-2 text-xs font-mono">
                <div className="text-zinc-500 text-[10px] uppercase tracking-wider pb-1">
                  Indicadores Calculados
                </div>
                <div className="flex items-center gap-2 text-zinc-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Verificação de Regularidade Cadastral</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-marsala-accent"></span>
                  <span>Cálculo Exato do Tempo de Existência</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                  <span>Mapeamento Societário e de Administradores</span>
                </div>
              </div>
            </article>

          </div>

          {/* Row 2: 4 Architectural Specialized Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 3: Informações em Camadas */}
            <article className="rounded-2xl border border-white/[0.08] bg-[#060608] p-6 space-y-4 hover:border-white/[0.16] transition duration-200">
              <div className="p-2 rounded-lg bg-zinc-950 border border-white/[0.06] w-fit text-zinc-300">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Dados cadastrais em camadas
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Navegação intuitiva por abas: cadastro fiscal, todas as atividades secundárias, inscrições estaduais e quadro societário.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/[0.04] text-[10px] font-mono text-zinc-400">QSA</span>
                <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/[0.04] text-[10px] font-mono text-zinc-400">CNAEs</span>
                <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/[0.04] text-[10px] font-mono text-zinc-400">Inscrições</span>
              </div>
            </article>

            {/* Card 4: Histórico & Favoritos Privados */}
            <article className="rounded-2xl border border-white/[0.08] bg-[#060608] p-6 space-y-4 hover:border-white/[0.16] transition duration-200">
              <div className="p-2 rounded-lg bg-zinc-950 border border-white/[0.06] w-fit text-zinc-300">
                <Lock className="w-4 h-4 text-marsala-300" />
              </div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Privacidade & Histórico Local
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Suas pesquisas e empresas salvas ficam registradas unicamente no seu navegador (localStorage). Sem banco remoto e sem rastreamento de terceiros.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-950 border border-white/[0.06] text-[10px] font-mono text-zinc-400">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  100% Client-Side
                </span>
              </div>
            </article>

            {/* Card 5: Visualizador JSON */}
            <article className="rounded-2xl border border-white/[0.08] bg-[#060608] p-6 space-y-4 hover:border-white/[0.16] transition duration-200">
              <div className="p-2 rounded-lg bg-zinc-950 border border-white/[0.06] w-fit text-zinc-300">
                <Code className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Visualizador JSON Nativo
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Acesse a payload integral recebida da fonte para desenvolvedores e analistas técnicos, com visualizador em árvore e botão de cópia rápida.
              </p>
              <div className="pt-2">
                <span className="px-2.5 py-1 rounded bg-zinc-950 border border-white/[0.06] text-[10px] font-mono text-zinc-400">
                  {`{ "razao_social": "..." }`}
                </span>
              </div>
            </article>

            {/* Card 6: Relatório em PDF */}
            <article className="rounded-2xl border border-white/[0.08] bg-[#060608] p-6 space-y-4 hover:border-white/[0.16] transition duration-200">
              <div className="p-2 rounded-lg bg-zinc-950 border border-white/[0.06] w-fit text-zinc-300">
                <FileDown className="w-4 h-4 text-zinc-200" />
              </div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Relatório em PDF Diagramado
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Gere documentos executivos prontos para impressão ou arquivamento com design editorial, dados cadastrais e registro da data de consulta.
              </p>
              <div className="pt-2">
                <span className="px-2.5 py-1 rounded bg-zinc-950 border border-white/[0.06] text-[10px] font-mono text-zinc-400">
                  Exportação Direta
                </span>
              </div>
            </article>

          </div>

        </div>

      </div>
    </section>
  );
}
