/**
 * Accessible alert and status notification banner compliant with WCAG 2.1 AA.
 * Uses assertive/polite aria-live regions to inform screen readers immediately.
 */

import React from 'react';
import { WithdrawalResult } from '../types/inventory';

interface FeedbackBannerProps {
  error: string | null;
  errorDetails?: string[];
  successResult: WithdrawalResult | null;
  onDismiss: () => void;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  error,
  errorDetails = [],
  successResult,
  onDismiss,
}) => {
  if (!error && !successResult) {
    return null;
  }

  if (error) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="mb-6 rounded-lg bg-red-50 border-l-4 border-red-600 p-4 text-red-900 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h2 className="text-sm font-semibold text-red-800">{error}</h2>
              {errorDetails.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-xs text-red-700 space-y-1">
                  {errorDetails.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error notification"
            className="text-red-500 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded p-1"
          >
            <span aria-hidden="true" className="text-lg leading-none">&times;</span>
          </button>
        </div>
      </div>
    );
  }

  if (successResult) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mb-6 rounded-lg bg-emerald-50 border-l-4 border-emerald-600 p-4 text-emerald-900 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h2 className="text-sm font-semibold text-emerald-800">
                Withdrawal Recorded Successfully!
              </h2>
              <p className="mt-1 text-xs text-emerald-700">
                Checked out <strong>{successResult.quantidade}</strong> unit(s) of item{' '}
                <span className="font-mono font-semibold">{successResult.itemCodigo}</span>. Updated
                stock balance: <strong>{successResult.saldoAtual}</strong>.
              </p>
              {successResult.alertaEstoqueMinimo && (
                <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-100 border border-amber-300 rounded px-2.5 py-1">
                  <span aria-hidden="true">⚠️</span>
                  <span>Warning: Stock has reached or dropped below the minimum required threshold!</span>
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss success notification"
            className="text-emerald-600 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded p-1"
          >
            <span aria-hidden="true" className="text-lg leading-none">&times;</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
