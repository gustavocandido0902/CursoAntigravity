import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, RefreshCw, Calendar, Sparkles, AlertCircle } from 'lucide-react';

export default function PaymentForm({
  selectedPlan,
  isAddressValid,
  onSubmitPayment,
  isProcessing
}) {
  const [cardData, setCardData] = useState({
    number: '4532 8901 2345 7890',
    holder: 'MARIANA COSTA ALVES',
    expiry: '09/29',
    cvv: '842',
    cpf: '123.456.789-00'
  });

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardData({ ...cardData, number: formatted });
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
    }
    setCardData({ ...cardData, expiry: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAddressValid) return;
    onSubmitPayment(cardData);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e5dec9] shadow-sm space-y-6">
      {/* Cabeçalho do Pagamento */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0eae1] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#eaf3e8] text-[#2d5a37]">
              <CreditCard className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-[#1b3022]">Assinatura & Pagamento Recorrente</h3>
          </div>
          <p className="text-xs text-[#6e7267] mt-0.5">
            Cobrança semanal automática. Entrega garantida e vegetais colhidos sob demanda.
          </p>
        </div>

        {/* RESTRIÇÃO CUMPRIDA: ÚNICO MEIO PERMITIDO E EXIBIDO (SEM PIX OU BOLETO) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f4ece1] border border-[#ded3be] text-[#554d3d] text-xs font-bold">
          <RefreshCw className="w-3.5 h-3.5 text-[#bc6c25]" />
          <span>Exclusivo: Cartão de Crédito Recorrente</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Cartão de Crédito Interativo */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] h-[190px] rounded-2xl bg-gradient-to-tr from-[#1b3022] via-[#2d5a37] to-[#407a4c] text-white p-5 shadow-xl relative overflow-hidden flex flex-col justify-between border border-[#6b9080]/30 select-none">
            {/* Decorações orgânicas de fundo */}
            <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#a7c957]/10 blur-xl pointer-events-none" />
            <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full bg-[#dda15e]/10 blur-lg pointer-events-none" />

            {/* Topo do Cartão */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight font-serif">Horta-na-Mão</span>
                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded text-stone-200">Club</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-stone-300 font-mono">RECORRENTE</span>
                <div className="w-3 h-3 rounded-full bg-[#a7c957] opacity-80" />
              </div>
            </div>

            {/* Chip e Contactless */}
            <div className="flex items-center gap-3 z-10 pl-1">
              <div className="w-9 h-7 rounded-md bg-gradient-to-br from-[#dda15e] to-[#bc6c25] border border-amber-300/40 shadow-inner flex items-center justify-center">
                <div className="w-6 h-4 border border-amber-900/30 rounded-[3px]" />
              </div>
              <svg className="w-4 h-4 text-stone-300 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                <path d="M12 19a9 9 0 0 0 0-14" />
              </svg>
            </div>

            {/* Número e Dados do Titular */}
            <div className="z-10 space-y-1">
              <p className="font-mono text-base tracking-widest text-stone-100">
                {cardData.number || '•••• •••• •••• ••••'}
              </p>
              <div className="flex justify-between items-end text-[10px] text-stone-300 font-mono uppercase">
                <span className="truncate max-w-[170px]">{cardData.holder || 'NOME DO TITULAR'}</span>
                <span>EXP: {cardData.expiry || 'MM/AA'}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#6e7267]">
            <ShieldCheck className="w-4 h-4 text-[#2d5a37]" />
            <span>Processamento criptografado PCI-DSS Nível 1</span>
          </div>
        </div>

        {/* Formulário de Cartão de Crédito */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          {/* Nome do Titular */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#2d3748]">
              Nome Impresso no Cartão *
            </label>
            <input
              type="text"
              required
              value={cardData.holder}
              onChange={(e) => setCardData({ ...cardData, holder: e.target.value.toUpperCase() })}
              placeholder="MARIANA C ALVES"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border border-[#ded5c0] bg-white focus:border-[#2d5a37] focus:ring-2 focus:ring-[#2d5a37]/10 outline-none uppercase"
            />
          </div>

          {/* Número do Cartão */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#2d3748]">
              Número do Cartão de Crédito *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={cardData.number}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium border border-[#ded5c0] bg-white focus:border-[#2d5a37] focus:ring-2 focus:ring-[#2d5a37]/10 outline-none"
              />
              <CreditCard className="w-4 h-4 text-[#8a817c] absolute right-3.5 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Validade */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#2d3748]">
                Validade *
              </label>
              <input
                type="text"
                required
                value={cardData.expiry}
                onChange={handleExpiryChange}
                placeholder="MM/AA"
                className="w-full px-3 py-2.5 rounded-xl text-xs font-mono font-medium border border-[#ded5c0] bg-white focus:border-[#2d5a37] focus:ring-2 focus:ring-[#2d5a37]/10 outline-none text-center"
              />
            </div>

            {/* CVV */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#2d3748]">
                CVV *
              </label>
              <input
                type="password"
                required
                maxLength={4}
                value={cardData.cvv}
                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                placeholder="123"
                className="w-full px-3 py-2.5 rounded-xl text-xs font-mono font-medium border border-[#ded5c0] bg-white focus:border-[#2d5a37] focus:ring-2 focus:ring-[#2d5a37]/10 outline-none text-center"
              />
            </div>

            {/* CPF */}
            <div className="col-span-2 sm:col-span-1 space-y-1">
              <label className="block text-xs font-bold text-[#2d3748]">
                CPF do Titular *
              </label>
              <input
                type="text"
                required
                value={cardData.cpf}
                onChange={(e) => setCardData({ ...cardData, cpf: e.target.value })}
                placeholder="000.000.000-00"
                className="w-full px-3 py-2.5 rounded-xl text-xs font-mono font-medium border border-[#ded5c0] bg-white focus:border-[#2d5a37] focus:ring-2 focus:ring-[#2d5a37]/10 outline-none"
              />
            </div>
          </div>

          {/* Resumo da Cobrança Recorrente */}
          <div className="p-3.5 rounded-2xl bg-[#faf7ef] border border-[#ece4d0] space-y-1.5 text-xs text-[#525a53]">
            <div className="flex justify-between font-bold text-[#1b3022]">
              <span>Assinatura {selectedPlan.name}:</span>
              <span>R$ {selectedPlan.price},00 / semana</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#706c61]">
              <span>Taxa de Entrega (Zona Sul):</span>
              <span className="text-emerald-700 font-bold">Grátis</span>
            </div>
            <div className="pt-1.5 border-t border-[#ded5c0] text-[10px] text-[#706c61] leading-relaxed flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 text-[#bc6c25] shrink-0" />
              <span>
                Cobrança recorrente a cada ciclo semanal no cartão de crédito cadastrado. Pause ou cancele sem burocracia quando viajar.
              </span>
            </div>
          </div>

          {/* Botão de Finalização da Assinatura */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isAddressValid || isProcessing}
              className={`w-full py-4 px-6 rounded-2xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer ${
                !isAddressValid
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                  : isProcessing
                  ? 'bg-[#24422b] text-white opacity-90 cursor-wait'
                  : 'bg-[#2d5a37] hover:bg-[#23472b] text-white shadow-[#2d5a37]/25 hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#a7c957]" />
                  <span>Validando e Ativando Assinatura Recorrente...</span>
                </>
              ) : !isAddressValid ? (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>Endereço fora da Zona Sul (Bloqueado)</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#a7c957]" />
                  <span>Confirmar Assinatura Recorrente • R$ {selectedPlan.price}/sem</span>
                </>
              )}
            </button>
            {!isAddressValid && (
              <p className="text-[11px] text-red-600 text-center mt-2 font-medium">
                * Para liberar a assinatura, selecione um bairro válido da Zona Sul no formulário acima.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
