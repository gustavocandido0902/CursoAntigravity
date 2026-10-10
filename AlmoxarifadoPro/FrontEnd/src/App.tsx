/**
 * Main application component orchestrating live item inspection and withdrawal workflow.
 * Encapsulates responsive container layouts, error boundaries, and state synchronization.
 */

import React, { useState } from 'react';
import { FeedbackBanner } from './components/FeedbackBanner';
import { Header } from './components/Header';
import { ItemBalanceCard } from './components/ItemBalanceCard';
import { WithdrawalForm } from './components/WithdrawalForm';
import { useItemBalance } from './hooks/useItemBalance';
import { useWithdrawal } from './hooks/useWithdrawal';
import { ProductionShift } from './types/inventory';

export const App: React.FC = () => {
  const [currentQuery, setCurrentQuery] = useState<string>('');

  const {
    item,
    isLoading: isLoadingItem,
    error: balanceError,
    loadBalance,
    updateLocalBalance,
    resetBalance,
  } = useItemBalance();

  const {
    isSubmitting,
    submissionError,
    errorDetails,
    lastResult,
    executeWithdrawal,
    clearFeedback,
  } = useWithdrawal();

  const handleSearchItem = async (code: string) => {
    setCurrentQuery(code);
    clearFeedback();
    await loadBalance(code);
  };

  const handleSubmitWithdrawal = async (
    itemCode: string,
    quantity: number,
    badge: string,
    shift: ProductionShift
  ) => {
    const result = await executeWithdrawal(itemCode, quantity, badge, shift);
    if (result) {
      updateLocalBalance(result.saldoAtual);
    }
  };

  const handleDismissFeedback = () => {
    clearFeedback();
    if (balanceError) {
      resetBalance();
    }
  };

  const activeError = submissionError || balanceError;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Terminal de Retirada de Materiais
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Registro de saídas operacionais com atualização transacional e controle de estoque mínimo.
          </p>
        </div>

        <FeedbackBanner
          error={activeError}
          errorDetails={errorDetails}
          successResult={lastResult}
          onDismiss={handleDismissFeedback}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Withdrawal Form */}
          <div className="lg:col-span-7">
            <WithdrawalForm
              item={item}
              isLoadingItem={isLoadingItem}
              isSubmitting={isSubmitting}
              onSearchItem={handleSearchItem}
              onSubmitWithdrawal={handleSubmitWithdrawal}
            />
          </div>

          {/* Real-time Balance Panel */}
          <div className="lg:col-span-5 sticky top-24">
            <ItemBalanceCard
              item={item}
              isLoading={isLoadingItem}
              searchQuery={currentQuery}
            />

            {/* Quick tips for operator */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-xs text-slate-600">
              <h2 className="font-bold text-slate-800 mb-1">Diretrizes do Almoxarifado:</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-500">
                <li>Obrigatório registrar a matrícula do técnico para toda ferramenta ou EPI retirado.</li>
                <li>Turnos autorizados: <strong>A</strong> (manhã), <strong>B</strong> (tarde) e <strong>C</strong> (noite).</li>
                <li>Itens com estoque crítico acionam sinalização automática para o setor de suprimentos.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-200/80 border-t border-slate-300/80 py-4 text-center text-xs text-slate-600">
        Metalúrgica Vale do Aço S/A • Sistema Integrado de Almoxarifado • Conformidade ISO 9001 / NR-06
      </footer>
    </div>
  );
};

export default App;
