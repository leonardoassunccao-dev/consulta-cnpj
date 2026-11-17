/**
 * Normalizes BrasilAPI CNPJ schema into the CNPJ.ws format consumed by CNPJ Premium frontend.
 */
export function normalizeBrasilApi(b: any): any {
  if (!b) return null;

  return {
    razao_social: b.razao_social || 'Não informada',
    capital_social: String(b.capital_social ?? '0'),
    porte: {
      id: String(b.codigo_porte ?? ''),
      descricao: b.porte || 'Não informado',
    },
    natureza_juridica: {
      codigo: String(b.codigo_natureza_juridica ?? ''),
      descricao: b.natureza_juridica || 'Não informada',
    },
    estabelecimento: {
      cnpj: b.cnpj,
      nome_fantasia: b.nome_fantasia || '',
      situacao_cadastral: b.descricao_situacao_cadastral || 'ATIVA',
      data_inicio_atividade: b.data_inicio_atividade || null,
      data_situacao_cadastral: b.data_situacao_cadastral || null,
      tipo_logradouro: b.descricao_tipo_de_logradouro || '',
      logradouro: b.logradouro || '',
      numero: b.numero || '',
      complemento: b.complemento || '',
      bairro: b.bairro || '',
      cep: b.cep || '',
      ddd1: b.ddd_telefone_1 ? b.ddd_telefone_1.slice(0, 2) : '',
      telefone1: b.ddd_telefone_1 ? b.ddd_telefone_1.slice(2) : '',
      email: b.email || null,
      cidade: {
        id: b.codigo_municipio,
        nome: b.municipio || '',
        ibge_id: b.codigo_municipio_ibge,
      },
      estado: {
        sigla: b.uf || '',
      },
      uf: b.uf || '',
      atividade_principal: {
        id: String(b.cnae_fiscal || ''),
        secao: '',
        divisao: '',
        grupo: '',
        classe: '',
        subclasse: '',
        descricao: b.cnae_fiscal_descricao || '',
      },
      atividades_secundarias: Array.isArray(b.cnaes_secundarios)
        ? b.cnaes_secundarios.map((sec: any) => ({
            id: String(sec.codigo || ''),
            descricao: sec.descricao || '',
          }))
        : [],
      inscricoes_estaduais: [],
    },
    socios: Array.isArray(b.qsa)
      ? b.qsa.map((s: any) => ({
          nome: s.nome_socio || '',
          qualificacao_socio: {
            descricao: s.qualificacao_socio || 'Sócio',
          },
          faixa_etaria: s.faixa_etaria || '',
          data_entrada: s.data_entrada_sociedade || '',
        }))
      : [],
    _source: 'brasilapi_fallback',
  };
}
