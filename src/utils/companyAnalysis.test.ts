import { describe, expect, it } from 'vitest';
import { assessCompatibility, activityDuration, companySummary, companyView } from './companyAnalysis';
import { isValidCnpj } from './cnpj';

const company = { razao_social: 'Empresa Teste Ltda', estabelecimento: { cnpj: '19131243000197', situacao_cadastral: 'ATIVA', data_inicio_atividade: '2013-08-19', cidade: { nome: 'São Paulo' }, estado: { sigla: 'SP' }, atividade_principal: { id: '4520001', descricao: 'Serviços de manutenção e reparação mecânica de veículos automotores' }, atividades_secundarias: [] } };

describe('CNPJ Premium 2.0 analysis', () => {
  it('validates check digits before allowing a lookup', () => {
    expect(isValidCnpj('19131243000197')).toBe(true);
    expect(isValidCnpj('19131243000196')).toBe(false);
    expect(isValidCnpj('00000000000000')).toBe(false);
  });
  it('derives duration and a deterministic summary only from source fields', () => {
    expect(activityDuration('2020-01-15', new Date('2021-03-14'))).toBe('1 ano e 1 mês de atividade');
    expect(companySummary(companyView(company))).toContain('São Paulo/SP');
  });
  it('identifies activity compatibility without approval language', () => {
    const result = assessCompatibility(company, 'Manutenção de veículos pesados');
    expect(result.level).toBe('Alta');
    expect(result.explanation).toContain('atividades cadastradas');
  });
});
