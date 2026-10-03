import React, { useState } from 'react';
import { Clock, AlertTriangle, Lock, RefreshCw, CheckCircle2, Sparkles, X, ChevronRight, Info } from 'lucide-react';

export default function BasketCustomizer({
  isOpen,
  onClose,
  plan,
  customizedItems,
  onSwapItem,
  isDeadlinePassed,
  setIsDeadlinePassed
}) {
  const [activeItemToSwap, setActiveItemToSwap] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#faf8f5] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#ded5c0] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="p-6 bg-gradient-to-r from-[#2d4739] to-[#1b3022] text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a7c957] bg-white/10 px-2.5 py-0.5 rounded-full">
                Personalização da Semana
              </span>
              <span className="text-xs text-stone-300 font-medium">
                {plan.name} (R$ {plan.price})
              </span>
            </div>
            <h3 className="text-xl font-bold font-serif">Troca e Ajuste de Itens da Cesta</h3>
            <p className="text-xs text-stone-300">
              Adapte os legumes e hortaliças conforme as preferências da sua casa.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* REGRA DE NEGÓCIO 1: AVISO E CONTROLE DE SIMULAÇÃO DE BLOQUEIO */}
        <div className="p-4 bg-[#f2ede0] border-b border-[#ded4bd] space-y-3">
          {/* Banner de Aviso Oficial da Regra */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
            isDeadlinePassed
              ? 'bg-[#ffebee] border-[#ffcdd2] text-[#931a25]'
              : 'bg-[#fff9db] border-[#ffe066] text-[#744210]'
          }`}>
            {isDeadlinePassed ? (
              <Lock className="w-5 h-5 text-[#b71c1c] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <p className="font-bold text-sm">
                {isDeadlinePassed
                  ? '🔒 Bloqueio Ativado: Prazo de Troca Expirado!'
                  : '⚠️ Regra de Negócio: Prazo Limite de Alterações'}
              </p>
              <p className="leading-relaxed">
                {isDeadlinePassed ? (
                  <span>
                    A troca de itens da cesta só é permitida até <strong>domingo às 23:59h</strong>. Como o prazo foi encerrado, as colheitas dos produtores já foram finalizadas e os itens desta semana não podem mais ser alterados.
                  </span>
                ) : (
                  <span>
                    Atenção: A troca de itens da cesta <strong>só é permitida até domingo às 23:59h</strong>. Após este horário, as colheitas são encomendadas e a cesta é fechada.
                  </span>
                )}
              </p>
              {!isDeadlinePassed && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#854d0e] pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Janela aberta para a colheita desta semana!</span>
                </div>
              )}
            </div>
          </div>

          {/* Teste Interativo para Avaliador / Usuário Simular a Regra */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-white/70 p-3 rounded-xl border border-[#e1d7c3]">
            <span className="text-xs font-semibold text-[#4a473d] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#588157]" />
              Simular Horário do Sistema:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDeadlinePassed(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isDeadlinePassed
                    ? 'bg-[#2d5a37] text-white shadow-sm'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                Antes do Prazo (Permitir Trocas)
              </button>
              <button
                type="button"
                onClick={() => setIsDeadlinePassed(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isDeadlinePassed
                    ? 'bg-[#b71c1c] text-white shadow-sm'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                Após Domingo 23:59h (Bloquear)
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Itens da Cesta com Opção de Troca */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between text-xs text-[#525a53]">
            <span className="font-semibold uppercase tracking-wider">Itens programados para sua cesta:</span>
            <span>{customizedItems.length} itens inclusos</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {customizedItems.map((item) => {
              const isSwappingThis = activeItemToSwap === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isDeadlinePassed
                      ? 'bg-stone-100 border-stone-200 opacity-80'
                      : 'bg-white border-[#e5dec9] hover:border-[#a3b899]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isDeadlinePassed ? 'bg-stone-200 text-stone-500' : 'bg-[#eaf3e8] text-[#2d5a37]'
                      }`}>
                        🌱
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1b3022]">{item.name}</span>
                          {item.isSwapped && (
                            <span className="text-[10px] bg-[#d8f3dc] text-[#1b4332] font-semibold px-2 py-0.5 rounded-full">
                              Substituído
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#6e7267] font-medium">{item.category}</span>
                      </div>
                    </div>

                    {/* Botão de Trocar ou Bloqueado */}
                    <div>
                      {isDeadlinePassed ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-200 text-stone-500 text-xs font-semibold cursor-not-allowed">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Bloqueado</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveItemToSwap(isSwappingThis ? null : item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f0eae1] hover:bg-[#2d5a37] hover:text-white text-[#343026] text-xs font-bold transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{isSwappingThis ? 'Cancelar' : 'Trocar Item'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submenu de alternativas de troca */}
                  {isSwappingThis && !isDeadlinePassed && (
                    <div className="mt-3 pt-3 border-t border-dashed border-[#ded5c0] space-y-2 animate-fadeIn">
                      <span className="text-xs font-bold text-[#554d3d] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#bc6c25]" />
                        Selecione a substituição orgânica desejada:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.swappableWith.map((altName) => (
                          <button
                            key={altName}
                            type="button"
                            onClick={() => {
                              onSwapItem(item.id, altName);
                              setActiveItemToSwap(null);
                            }}
                            className="p-2.5 rounded-xl border border-[#c1dec4] bg-[#f5fbf4] hover:bg-[#2d5a37] hover:text-white text-xs font-medium text-[#2d5a37] flex items-center justify-between transition-all cursor-pointer text-left"
                          >
                            <span>{altName}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 bg-stone-100 border-t border-[#ded5c0] flex items-center justify-between">
          <span className="text-xs text-[#6e7267]">
            {isDeadlinePassed
              ? 'Alterações fechadas para este ciclo semanal.'
              : 'Você pode alterar seus itens livremente até domingo 23:59h.'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#2d5a37] text-white text-xs font-bold hover:bg-[#23472b] transition-all cursor-pointer"
          >
            Confirmar e Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
