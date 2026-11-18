import { describe, expect, it } from 'vitest';
import { readJsonWithStreamLimit, validateAndSanitizeCnpjData } from './cnpjSchema';

describe('readJsonWithStreamLimit', () => {
  it('reads normal json stream within 1 MB limit', async () => {
    const data = { ok: true, message: 'valid corporate data' };
    const jsonStr = JSON.stringify(data);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(jsonStr));
        controller.close();
      },
    });

    const response = new Response(stream, {
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await readJsonWithStreamLimit(response, 1024);
    expect(result).toEqual(data);
  });

  it('rejects immediately when Content-Length header exceeds limit', async () => {
    const response = new Response('{}', {
      headers: { 'Content-Length': '2097152' }, // 2 MB
    });

    await expect(readJsonWithStreamLimit(response, 1_048_576)).rejects.toThrow('PAYLOAD_TOO_LARGE');
  });

  it('aborts stream reading as soon as chunk size exceeds limit', async () => {
    let cancelled = false;
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(600));
        controller.enqueue(new Uint8Array(600));
      },
      cancel() {
        cancelled = true;
      },
    });

    const response = new Response(stream);
    await expect(readJsonWithStreamLimit(response, 1000)).rejects.toThrow('PAYLOAD_TOO_LARGE');
    expect(cancelled).toBe(true);
  });
});

describe('validateAndSanitizeCnpjData', () => {
  it('preserves legitimate enterprise data and bounds excessive lengths', () => {
    const raw = {
      razao_social: 'EMPRESA EXEMPLO S/A ' + 'A'.repeat(600),
      capital_social: '1500000',
      porte: { id: '05', descricao: 'DEMAIS' },
      natureza_juridica: { codigo: '2046', descricao: 'Sociedade Anônima Aberta' },
      estabelecimento: {
        cnpj: '47960950000121',
        nome_fantasia: 'FANTASIA EXEMPLO',
        situacao_cadastral: 'ATIVA',
        logradouro: 'RUA DAS FLORES',
        cidade: { id: 1234, nome: 'SAO PAULO', ibge_id: 3550308 },
        uf: 'SP',
        atividade_principal: { id: '4713004', descricao: 'Comércio varejista' },
        atividades_secundarias: [
          { id: '1234567', descricao: 'Secundária 1' },
        ],
      },
      socios: [
        { nome: 'DIRETOR EXEMPLO', qualificacao_socio: { descricao: 'Presidente' } },
      ],
      _source: 'cnpj_ws',
    };

    const sanitized = validateAndSanitizeCnpjData(raw);

    expect(sanitized.razao_social.length).toBe(500); // Truncated to max 500
    expect(sanitized.razao_social.startsWith('EMPRESA EXEMPLO S/A')).toBe(true);
    expect(sanitized.capital_social).toBe('1500000');
    expect(sanitized.estabelecimento.cnpj).toBe('47960950000121');
    expect(sanitized.estabelecimento.cidade.nome).toBe('SAO PAULO');
    expect(sanitized.socios[0].nome).toBe('DIRETOR EXEMPLO');
    expect(sanitized.socios[0].qualificacao_socio.descricao).toBe('Presidente');
  });

  it('handles corrupted or non-object payloads gracefully', () => {
    expect(validateAndSanitizeCnpjData(null)).toBeNull();
    expect(validateAndSanitizeCnpjData('string')).toBeNull();
    expect(validateAndSanitizeCnpjData([])).toBeNull();
  });
});
