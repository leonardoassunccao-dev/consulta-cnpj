import { describe, expect, it } from 'vitest';
import { normalizeBrasilApi } from './cnpjNormalizer';

describe('BrasilAPI normalizer adapter', () => {
  it('correctly maps BrasilAPI schema to CNPJ Premium data model', () => {
    const raw = {
      cnpj: '47960950000121',
      razao_social: 'MAGAZINE LUIZA S/A',
      nome_fantasia: 'MAGAZINE LUIZA',
      descricao_situacao_cadastral: 'ATIVA',
      data_inicio_atividade: '1966-10-24',
      cnae_fiscal: 4713004,
      cnae_fiscal_descricao: 'Lojas de departamentos ou magazines',
      cnaes_secundarios: [
        { codigo: 3329501, descricao: 'Serviços de montagem de móveis' },
      ],
      municipio: 'FRANCA',
      uf: 'SP',
      capital_social: 14202162000,
      porte: 'DEMAIS',
      qsa: [
        {
          nome_socio: 'FREDERICO TRAJANO',
          qualificacao_socio: 'Presidente',
        },
      ],
    };

    const normalized = normalizeBrasilApi(raw);
    expect(normalized.razao_social).toBe('MAGAZINE LUIZA S/A');
    expect(normalized.estabelecimento.cnpj).toBe('47960950000121');
    expect(normalized.estabelecimento.cidade.nome).toBe('FRANCA');
    expect(normalized.estabelecimento.atividade_principal.descricao).toBe('Lojas de departamentos ou magazines');
    expect(normalized.socios[0].nome).toBe('FREDERICO TRAJANO');
    expect(normalized._source).toBe('brasilapi_fallback');
  });

  it('handles null or empty inputs gracefully', () => {
    expect(normalizeBrasilApi(null)).toBeNull();
  });
});
