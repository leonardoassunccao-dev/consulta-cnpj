/**
 * Schema validation and stream size protection for external CNPJ API responses.
 */

const MAX_STREAM_BYTES = 1_048_576; // 1 MB strict stream limit

/**
 * Safely reads JSON from an HTTP Response stream up to maxBytes.
 * Cancels stream immediately if Content-Length or received bytes exceed maxBytes,
 * avoiding buffering oversized payloads into memory.
 */
export async function readJsonWithStreamLimit<T = any>(
  res: Response,
  maxBytes = MAX_STREAM_BYTES
): Promise<T> {
  const contentLength = res.headers.get('content-length');
  if (contentLength && Number(contentLength) > maxBytes) {
    throw new Error('PAYLOAD_TOO_LARGE');
  }

  if (!res.body) {
    throw new Error('EMPTY_RESPONSE_BODY');
  }

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.length;
        if (totalBytes > maxBytes) {
          await reader.cancel();
          throw new Error('PAYLOAD_TOO_LARGE');
        }
        chunks.push(value);
      }
    }
  } catch (err) {
    try {
      await reader.cancel();
    } catch {}
    throw err;
  }

  const fullBuffer = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    fullBuffer.set(chunk, offset);
    offset += chunk.length;
  }

  const text = new TextDecoder('utf-8').decode(fullBuffer);
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('INVALID_JSON');
  }
}

/**
 * Sanitizes and truncates a string safely.
 */
function sanitizeString(val: any, maxLength: number, fallback = ''): string {
  if (val === null || val === undefined) return fallback;
  const str = String(val).trim();
  if (str.length > maxLength) {
    return str.slice(0, maxLength);
  }
  return str;
}

/**
 * Validates and sanitizes CNPJ data model received from upstream providers.
 * Preserves all legitimate corporate data while preventing prototype pollution,
 * out-of-bounds strings and malformed nested objects.
 */
export function validateAndSanitizeCnpjData(raw: any): any {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const estab = raw.estabelecimento && typeof raw.estabelecimento === 'object' && !Array.isArray(raw.estabelecimento)
    ? raw.estabelecimento
    : {};

  const cleanCnpj = sanitizeString(estab.cnpj || raw.cnpj, 14).replace(/\D/g, '');

  const sanitizeActivity = (act: any) => {
    if (!act || typeof act !== 'object') return { id: '', descricao: '' };
    return {
      id: sanitizeString(act.id, 30),
      secao: sanitizeString(act.secao, 10),
      divisao: sanitizeString(act.divisao, 10),
      grupo: sanitizeString(act.grupo, 10),
      classe: sanitizeString(act.classe, 10),
      subclasse: sanitizeString(act.subclasse, 10),
      descricao: sanitizeString(act.descricao, 500),
    };
  };

  const secondaryActivities = Array.isArray(estab.atividades_secundarias)
    ? estab.atividades_secundarias.slice(0, 200).map((act: any) => ({
        id: sanitizeString(act?.id, 30),
        descricao: sanitizeString(act?.descricao, 500),
      }))
    : [];

  const socios = Array.isArray(raw.socios)
    ? raw.socios.slice(0, 300).map((socio: any) => ({
        nome: sanitizeString(socio?.nome, 300),
        qualificacao_socio: {
          descricao: sanitizeString(socio?.qualificacao_socio?.descricao || socio?.qualificacao, 200, 'Sócio'),
        },
        faixa_etaria: sanitizeString(socio?.faixa_etaria, 100),
        data_entrada: sanitizeString(socio?.data_entrada, 50),
      }))
    : [];

  return {
    razao_social: sanitizeString(raw.razao_social, 500, 'Não informada'),
    capital_social: sanitizeString(raw.capital_social, 30, '0'),
    porte: {
      id: sanitizeString(raw.porte?.id, 20),
      descricao: sanitizeString(raw.porte?.descricao, 150, 'Não informado'),
    },
    natureza_juridica: {
      codigo: sanitizeString(raw.natureza_juridica?.codigo, 20),
      descricao: sanitizeString(raw.natureza_juridica?.descricao, 250, 'Não informada'),
    },
    estabelecimento: {
      cnpj: cleanCnpj,
      nome_fantasia: sanitizeString(estab.nome_fantasia, 500),
      situacao_cadastral: sanitizeString(estab.situacao_cadastral, 100, 'ATIVA'),
      data_inicio_atividade: sanitizeString(estab.data_inicio_atividade, 50) || null,
      data_situacao_cadastral: sanitizeString(estab.data_situacao_cadastral, 50) || null,
      tipo_logradouro: sanitizeString(estab.tipo_logradouro, 100),
      logradouro: sanitizeString(estab.logradouro, 300),
      numero: sanitizeString(estab.numero, 50),
      complemento: sanitizeString(estab.complemento, 200),
      bairro: sanitizeString(estab.bairro, 200),
      cep: sanitizeString(estab.cep, 20),
      ddd1: sanitizeString(estab.ddd1, 10),
      telefone1: sanitizeString(estab.telefone1, 30),
      email: estab.email ? sanitizeString(estab.email, 200) : null,
      cidade: {
        id: typeof estab.cidade?.id === 'number' ? estab.cidade.id : null,
        nome: sanitizeString(estab.cidade?.nome, 200),
        ibge_id: typeof estab.cidade?.ibge_id === 'number' ? estab.cidade.ibge_id : null,
      },
      estado: {
        sigla: sanitizeString(estab.estado?.sigla || estab.uf, 10),
      },
      uf: sanitizeString(estab.uf || estab.estado?.sigla, 10),
      atividade_principal: sanitizeActivity(estab.atividade_principal),
      atividades_secundarias: secondaryActivities,
      inscricoes_estaduais: Array.isArray(estab.inscricoes_estaduais) ? estab.inscricoes_estaduais.slice(0, 50) : [],
    },
    socios,
    _source: sanitizeString(raw._source, 50, 'cnpj_ws'),
  };
}
