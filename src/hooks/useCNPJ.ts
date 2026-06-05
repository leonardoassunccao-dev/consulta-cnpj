import { useState, useCallback, useEffect } from 'react';
import { fetchCnpj, CnpjApiResponse } from '../services/cnpjApi';

export interface UseCNPJResult {
  isLoading: boolean;
  data: any | null;
  error: string | null;
  errorType: 'INVALID_CNPJ' | 'NOT_FOUND' | 'TIMEOUT' | 'UNKNOWN' | 'CONNECTION' | 'API_ERROR' | null;
  consultarCNPJ: (cnpj: string) => Promise<boolean>;
  limpar: () => void;
}

const LOCAL_STORAGE_KEY = 'premium_cnpj_last_result';

export function useCNPJ(): UseCNPJResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<UseCNPJResult['errorType']>(null);

  // Restore last query on initialization
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          setData(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse cached CNPJ result:', e);
    }
  }, []);

  const consultarCNPJ = useCallback(async (cnpj: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setErrorType(null);

    try {
      const response: CnpjApiResponse = await fetchCnpj(cnpj);

      if (response.success) {
        setData(response.data);
        setError(null);
        setErrorType(null);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(response.data));
        } catch (e) {
          // Local storage quota exceeded or disabled
        }
        return true;
      } else {
        setData(null);
        setError(response.error || 'Erro desconhecido');
        setErrorType(response.errorType || 'UNKNOWN');
        return false;
      }
    } catch (e: any) {
      setData(null);
      setError(e.message || 'Erro inesperado ao realizar consulta.');
      setErrorType('UNKNOWN');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const limpar = useCallback(() => {
    setData(null);
    setError(null);
    setErrorType(null);
    setIsLoading(false);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      // Local storage issues
    }
  }, []);

  return {
    isLoading,
    data,
    error,
    errorType,
    consultarCNPJ,
    limpar,
  };
}
