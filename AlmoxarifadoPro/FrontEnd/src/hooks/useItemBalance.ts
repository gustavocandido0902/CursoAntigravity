/**
 * Assumption: The warehouse operator searches or verifies the stock before checking out.
 * This hook manages retrieval, loading indicators, and manual refresh triggers.
 */

import { useCallback, useState } from 'react';
import { ApiError, fetchItemBalance } from '../services/api';
import { Item } from '../types/inventory';

interface UseItemBalanceReturn {
  item: Item | null;
  isLoading: boolean;
  error: string | null;
  loadBalance: (code: string) => Promise<Item | null>;
  resetBalance: () => void;
  updateLocalBalance: (newBalance: number) => void;
}

export function useItemBalance(): UseItemBalanceReturn {
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadBalance = useCallback(async (code: string): Promise<Item | null> => {
    const trimmed = code.trim();
    if (!trimmed) {
      setItem(null);
      setError(null);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchItemBalance(trimmed);
      setItem(data);
      return data;
    } catch (err: unknown) {
      setItem(null);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected network error occurred while querying the item.');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetBalance = useCallback(() => {
    setItem(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const updateLocalBalance = useCallback((newBalance: number) => {
    setItem((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        saldoAtual: newBalance,
        abaixoMinimo: newBalance <= prev.estoqueMinimo,
      };
    });
  }, []);

  return {
    item,
    isLoading,
    error,
    loadBalance,
    resetBalance,
    updateLocalBalance,
  };
}
