import { describe, expect, it, vi } from 'vitest';
import { downloadCompanyReport } from './report';

const mockSave = vi.fn();
const mockText = vi.fn();
const mockRect = vi.fn();
const mockAddPage = vi.fn();
const mockSetFillColor = vi.fn();
const mockSetTextColor = vi.fn();
const mockSetFont = vi.fn();
const mockSetFontSize = vi.fn();
const mockSplitTextToSize = vi.fn().mockImplementation((text: string) => text.split('\n'));

vi.mock('jspdf', () => {
  return {
    jsPDF: class {
      save = mockSave;
      text = mockText;
      rect = mockRect;
      addPage = mockAddPage;
      setFillColor = mockSetFillColor;
      setTextColor = mockSetTextColor;
      setFont = mockSetFont;
      setFontSize = mockSetFontSize;
      splitTextToSize = mockSplitTextToSize;
    },
  };
});

describe('PDF Report generation', () => {
  it('generates a PDF report without throwing errors and saves with sanitized filename', () => {
    const sampleCompany = {
      razao_social: 'EMPRESA EXEMPLO S.A.',
      capital_social: '5000000.00',
      estabelecimento: {
        cnpj: '47960950000121',
        nome_fantasia: 'EXEMPLO CORP',
        situacao_cadastral: 'Ativa',
        data_inicio_atividade: '2015-05-10',
        cidade: { nome: 'São Paulo' },
        estado: { sigla: 'SP' },
        atividade_principal: {
          id: '6201-5/00',
          descricao: 'Desenvolvimento de programas de computador sob encomenda',
        },
        atividades_secundarias: [],
      },
      porte: { descricao: 'Demais' },
    };

    downloadCompanyReport(sampleCompany, '2026-11-17T18:00:00Z', {
      purpose: 'Homologação de Fornecedor',
      service: 'desenvolvimento de software',
      level: 'Alta',
      explanation: 'Atividade compatível com o serviço.',
    });

    expect(mockSave).toHaveBeenCalledWith('cnpj-premium-47960950000121.pdf');
    expect(mockText).toHaveBeenCalled();
  });
});
