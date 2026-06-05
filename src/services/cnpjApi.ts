export interface CnpjApiResponse {
  success: boolean;
  data: any | null;
  error?: string;
  errorType?: 'INVALID_CNPJ' | 'NOT_FOUND' | 'TIMEOUT' | 'UNKNOWN' | 'CONNECTION' | 'API_ERROR';
}

/**
 * Clean characters from CNPJ, leaving only digits
 */
export function cleanCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

/**
 * Basic CNPJ validation (checks for 14 digits)
 */
export function validateCnpjFormat(cnpjLimpo: string): boolean {
  return cnpjLimpo.length === 14 && /^\d+$/.test(cnpjLimpo);
}

/**
 * Fetches CNPJ information from our local route with automatic timeout.
 */
export async function fetchCnpj(cnpj: string, timeoutMs: number = 15000): Promise<CnpjApiResponse> {
  const cnpjLimpo = cleanCnpj(cnpj);

  if (!validateCnpjFormat(cnpjLimpo)) {
    return {
      success: false,
      data: null,
      error: 'O CNPJ deve conter exatamente 14 números.',
      errorType: 'INVALID_CNPJ',
    };
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`/api/cnpj/${cnpjLimpo}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(id);

    if (response.status === 404) {
      return {
        success: false,
        data: null,
        error: 'CNPJ não encontrado na base de dados.',
        errorType: 'NOT_FOUND',
      };
    }

    if (response.status === 400) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        data: null,
        error: errData.error || 'Argumento de CNPJ inválido ou mal formatado.',
        errorType: 'INVALID_CNPJ',
      };
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        data: null,
        error: errData.error || `Erro do servidor externo (${response.status}).`,
        errorType: 'API_ERROR',
      };
    }

    const data = await response.json();
    
    // Check if the response returned an error field from the API
    if (data && data.status === 'error' || (data && data.error)) {
      return {
        success: false,
        data: null,
        error: data.message || data.error || 'Erro reportado pelo servidor de CNPJ.',
        errorType: 'API_ERROR',
      };
    }

    return {
      success: true,
      data,
    };

  } catch (error: any) {
    clearTimeout(id);

    if (error.name === 'AbortError') {
      return {
        success: false,
        data: null,
        error: 'A consulta excedeu o tempo limite. Tente novamente mais tarde.',
        errorType: 'TIMEOUT',
      };
    }

    return {
      success: false,
      data: null,
      error: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
      errorType: 'CONNECTION',
    };
  }
}
