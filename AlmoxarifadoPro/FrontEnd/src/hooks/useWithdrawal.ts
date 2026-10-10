/**
 * Assumption: Withdrawals require synchronous transaction feedback to prevent
 * stock divergence. Validation is executed before reaching the API client.
 */

import { useCallback, useState } from 'react';
import { ApiError, submitWithdrawal } from '../services/api';
import { ProductionShift, WithdrawalPayload, WithdrawalResult } from '../types/inventory';

interface UseWithdrawalReturn {
  isSubmitting: boolean;
  submissionError: string | null;
  errorDetails: string[];
  lastResult: WithdrawalResult | null;
  executeWithdrawal: (
    itemCode: string,
    quantity: number,
    badge: string,
    shift: ProductionShift
  ) => Promise<WithdrawalResult | null>;
  clearFeedback: () => void;
}

export function useWithdrawal(): UseWithdrawalReturn {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<WithdrawalResult | null>(null);

  const clearFeedback = useCallback(() => {
    setSubmissionError(null);
    setErrorDetails([]);
    setLastResult(null);
  }, []);

  const executeWithdrawal = useCallback(
    async (
      itemCode: string,
      quantity: number,
      badge: string,
      shift: ProductionShift
    ): Promise<WithdrawalResult | null> => {
      clearFeedback();

      const errors: string[] = [];
      if (!itemCode.trim()) errors.push('Item code is required.');
      if (quantity <= 0) errors.push('Quantity must be greater than zero.');
      if (!badge.trim()) errors.push('Technician badge number is required.');
      if (!['A', 'B', 'C'].includes(shift)) errors.push('Production shift must be A, B, or C.');

      if (errors.length > 0) {
        setSubmissionError('Validation failed. Please correct the highlighted fields.');
        setErrorDetails(errors);
        return null;
      }

      setIsSubmitting(true);

      const payload: WithdrawalPayload = {
        itemCodigo: itemCode.trim(),
        tipo: 'retirada',
        quantidade: quantity,
        tecnicoMatricula: badge.trim(),
        turno: shift,
      };

      try {
        const result = await submitWithdrawal(payload);
        setLastResult(result);
        return result;
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          setSubmissionError(err.message);
          setErrorDetails(err.details || []);
        } else {
          setSubmissionError('Failed to record withdrawal. Please verify network connectivity.');
        }
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [clearFeedback]
  );

  return {
    isSubmitting,
    submissionError,
    errorDetails,
    lastResult,
    executeWithdrawal,
    clearFeedback,
  };
}
