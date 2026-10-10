/**
 * Card displaying real-time item details, current stock balance, and stock threshold warnings.
 * Uses high contrast indicators and ARIA live attributes for immediate accessibility feedback.
 */

import React from 'react';
import { Item } from '../types/inventory';

interface ItemBalanceCardProps {
  item: Item | null;
  isLoading: boolean;
  searchQuery: string;
}

export const ItemBalanceCard: React.FC<ItemBalanceCardProps> = ({
  item,
  isLoading,
  searchQuery,
}) => {
  if (isLoading) {
    return (
      <div
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center min-h-[220px]"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-sm text-slate-600 font-medium">Querying warehouse inventory...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div
        className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-[220px]"
        aria-live="polite"
      >
        <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-700">No Item Selected</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          {searchQuery.trim()
            ? `Search item "${searchQuery.trim()}" to inspect current balance.`
            : 'Enter an item code in the form to view real-time stock balance.'}
        </p>
      </div>
    );
  }

  const isCriticalStock = item.abaixoMinimo || item.saldoAtual <= item.estoqueMinimo;

  return (
    <section
      aria-labelledby="balance-card-heading"
      className={`rounded-xl border p-6 shadow-sm transition-all duration-200 bg-white ${
        isCriticalStock ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-300">
            {item.itemCodigo}
          </span>
          <h2 id="balance-card-heading" className="text-lg font-bold text-slate-900 mt-2">
            {item.nome}
          </h2>
        </div>

        {isCriticalStock ? (
          <span
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300"
            role="status"
          >
            <span aria-hidden="true">⚠️</span> Estoque Crítico
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300"
            role="status"
          >
            <span aria-hidden="true">✓</span> Normal
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Saldo Físico</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-3xl font-extrabold tracking-tight ${
                isCriticalStock ? 'text-amber-600' : 'text-slate-900'
              }`}
            >
              {item.saldoAtual}
            </span>
            <span className="text-sm font-semibold text-slate-500">{item.unidadeMedida}</span>
          </div>
        </div>

        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mínimo de Alerta</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold tracking-tight text-slate-700">
              {item.estoqueMinimo}
            </span>
            <span className="text-sm font-semibold text-slate-500">{item.unidadeMedida}</span>
          </div>
        </div>
      </div>

      {isCriticalStock && (
        <p className="mt-4 text-xs font-medium text-amber-700 bg-amber-100/60 p-2.5 rounded-lg border border-amber-200">
          Atenção: Saldo atual atingiu ou está abaixo do limite de segurança ({item.estoqueMinimo}{' '}
          {item.unidadeMedida}).
        </p>
      )}
    </section>
  );
};
