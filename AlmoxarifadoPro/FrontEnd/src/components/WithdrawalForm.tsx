/**
 * Primary checkout form allowing warehouse keepers to register material withdrawals.
 * Follows WCAG 2.1 AA specifications with explicit label bindings, aria-describedby,
 * clear focus states, and keyboard accessibility.
 */

import React, { FormEvent, useState } from 'react';
import { Item, ProductionShift } from '../types/inventory';

interface WithdrawalFormProps {
  item: Item | null;
  isLoadingItem: boolean;
  isSubmitting: boolean;
  onSearchItem: (code: string) => void;
  onSubmitWithdrawal: (itemCode: string, quantity: number, badge: string, shift: ProductionShift) => void;
}

export const WithdrawalForm: React.FC<WithdrawalFormProps> = ({
  item,
  isLoadingItem,
  isSubmitting,
  onSearchItem,
  onSubmitWithdrawal,
}) => {
  const [itemCode, setItemCode] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [badge, setBadge] = useState<string>('');
  const [shift, setShift] = useState<ProductionShift>('A');

  const [fieldErrors, setFieldErrors] = useState<{
    itemCode?: string;
    quantity?: string;
    badge?: string;
  }>({});

  const handleItemBlur = () => {
    if (itemCode.trim() && (!item || item.itemCodigo !== itemCode.trim())) {
      onSearchItem(itemCode);
    }
  };

  const validate = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!itemCode.trim()) {
      errors.itemCode = 'Código do item é obrigatório.';
    }

    const numQty = Number(quantity);
    if (!quantity || isNaN(numQty) || numQty <= 0) {
      errors.quantity = 'Informe uma quantidade maior que zero.';
    } else if (item && numQty > item.saldoAtual) {
      errors.quantity = `Quantidade solicitada (${numQty}) excede o saldo disponível (${item.saldoAtual}).`;
    }

    if (!badge.trim()) {
      errors.badge = 'Matrícula do técnico solicitante é obrigatória.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmitWithdrawal(itemCode.trim(), Number(quantity), badge.trim(), shift);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-labelledby="form-heading"
    >
      <div className="border-b border-slate-100 pb-4 mb-5">
        <h2 id="form-heading" className="text-base font-bold text-slate-900">
          Registrar Retirada de Material
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Preencha os dados do técnico e turno para garantir rastreabilidade industrial.
        </p>
      </div>

      <div className="space-y-4">
        {/* Item Code */}
        <div>
          <label htmlFor="item-code-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Código do Material / SKU <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <div className="flex gap-2">
            <input
              id="item-code-input"
              type="text"
              value={itemCode}
              onChange={(e) => {
                setItemCode(e.target.value);
                if (fieldErrors.itemCode) setFieldErrors((prev) => ({ ...prev, itemCode: undefined }));
              }}
              onBlur={handleItemBlur}
              placeholder="Ex: BRO-0042, EPI-0012"
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.itemCode)}
              aria-describedby={fieldErrors.itemCode ? 'item-code-error' : undefined}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                fieldErrors.itemCode ? 'border-red-500 bg-red-50/20' : 'border-slate-300 bg-white'
              }`}
            />
            <button
              type="button"
              onClick={() => onSearchItem(itemCode)}
              disabled={isLoadingItem || !itemCode.trim()}
              aria-label="Verificar saldo do item"
              className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 flex-shrink-0"
            >
              {isLoadingItem ? 'Buscando...' : 'Verificar'}
            </button>
          </div>
          {fieldErrors.itemCode && (
            <p id="item-code-error" className="mt-1 text-xs text-red-600 font-medium" role="alert">
              {fieldErrors.itemCode}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Quantidade a Retirar <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="quantity-input"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              if (fieldErrors.quantity) setFieldErrors((prev) => ({ ...prev, quantity: undefined }));
            }}
            aria-required="true"
            aria-invalid={Boolean(fieldErrors.quantity)}
            aria-describedby={fieldErrors.quantity ? 'quantity-error' : undefined}
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              fieldErrors.quantity ? 'border-red-500 bg-red-50/20' : 'border-slate-300 bg-white'
            }`}
          />
          {fieldErrors.quantity && (
            <p id="quantity-error" className="mt-1 text-xs text-red-600 font-medium" role="alert">
              {fieldErrors.quantity}
            </p>
          )}
        </div>

        {/* Technician Registration Badge */}
        <div>
          <label htmlFor="technician-badge-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Matrícula do Técnico <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="technician-badge-input"
            type="text"
            value={badge}
            onChange={(e) => {
              setBadge(e.target.value);
              if (fieldErrors.badge) setFieldErrors((prev) => ({ ...prev, badge: undefined }));
            }}
            placeholder="Ex: T-10931"
            aria-required="true"
            aria-invalid={Boolean(fieldErrors.badge)}
            aria-describedby={fieldErrors.badge ? 'badge-error' : undefined}
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              fieldErrors.badge ? 'border-red-500 bg-red-50/20' : 'border-slate-300 bg-white'
            }`}
          />
          {fieldErrors.badge && (
            <p id="badge-error" className="mt-1 text-xs text-red-600 font-medium" role="alert">
              {fieldErrors.badge}
            </p>
          )}
        </div>

        {/* Shift Selection */}
        <fieldset className="border-0 p-0 m-0">
          <legend className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Turno de Produção <span className="text-red-600" aria-hidden="true">*</span>
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {(['A', 'B', 'C'] as ProductionShift[]).map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-center justify-center rounded-lg border p-2.5 text-sm font-semibold transition-all ${
                  shift === option
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="production-shift"
                  value={option}
                  checked={shift === option}
                  onChange={() => setShift(option)}
                  className="sr-only"
                />
                Turno {option}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="w-4 h-4 mr-2 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processando...
            </>
          ) : (
            'Confirmar Retirada'
          )}
        </button>
      </div>
    </form>
  );
};
