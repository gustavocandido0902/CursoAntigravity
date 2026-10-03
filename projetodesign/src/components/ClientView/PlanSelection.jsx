import React from 'react';
import { BASKET_PLANS } from '../../data/mockData';
import { Check, Sparkles, Users, Salad, ArrowRight } from 'lucide-react';

export default function PlanSelection({ selectedPlan, onSelectPlan, onOpenCustomizer }) {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f1e6] text-[#2c5835] border border-[#c1dec4]">
          <Salad className="w-3.5 h-3.5" /> Planos de Assinatura Semanal
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1b3022] font-serif">
          Escolha a Cesta Perfeita para a sua Rotina
        </h2>
        <p className="text-sm text-[#5f685f]">
          Alimentos colhidos no ponto ideal na véspera da entrega. Cancele ou pause quando quiser, sem taxas.
        </p>
      </div>

      {/* Grid com os 3 planos requeridos: Pequeno (R$ 50), Médio (R$ 80) e Grande (R$ 120) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {BASKET_PLANS.map((plan) => {
          const isSelected = selectedPlan.id === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => onSelectPlan(plan)}
              className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-[#f3f9f1] to-white border-2 border-[#2d5a37] shadow-xl shadow-[#2d5a37]/10 scale-[1.02] ring-4 ring-[#2d5a37]/10'
                  : 'bg-white border border-[#e5dec9] hover:border-[#a3b899] hover:shadow-lg'
              }`}
            >
              {/* Badge superior */}
              {plan.highlight ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#bc6c25] text-white text-xs font-bold px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {plan.badge}
                </div>
              ) : (
                <div className="absolute -top-3 left-6 bg-[#eae3d2] text-[#4d483d] text-[11px] font-semibold px-3 py-0.5 rounded-full border border-[#ded5c0]">
                  {plan.badge}
                </div>
              )}

              {/* Informações do Plano */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-[#1b3022]">{plan.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#6e7267] mt-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#588157]" />
                      <span>{plan.serves}</span>
                      <span>•</span>
                      <span>{plan.itemsCount}</span>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                    isSelected ? 'bg-[#2d5a37] border-[#2d5a37] text-white' : 'border-stone-300'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-xs text-[#525a53] leading-relaxed">
                  {plan.description}
                </p>

                {/* Preço Obrigatório: R$ 50, R$ 80, R$ 120 */}
                <div className="bg-[#f8f6f0] p-3.5 rounded-2xl border border-[#ece4d0] flex items-baseline justify-between">
                  <span className="text-xs text-[#706c61] font-medium">Investimento:</span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-[#1b3022]">R$ {plan.price}</span>
                    <span className="text-xs text-[#706c61] font-semibold">{plan.frequency}</span>
                  </div>
                </div>

                {/* Prévia dos itens inclusos */}
                <div className="space-y-2 pt-1 border-t border-[#f0eae1]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#697268]">
                    Exemplos da colheita da semana:
                  </span>
                  <ul className="space-y-1.5">
                    {plan.items.slice(0, 4).map((item) => (
                      <li key={item.id} className="flex items-center text-xs text-[#3b433c] gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#588157] shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </li>
                    ))}
                    {plan.items.length > 4 && (
                      <li className="text-[11px] font-semibold text-[#588157] pl-3.5">
                        + mais {plan.items.length - 4} itens selecionados
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="pt-6 space-y-2">
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2d5a37] text-white shadow-md shadow-[#2d5a37]/20 hover:bg-[#23472b]'
                      : 'bg-[#e8e2d4] text-[#343026] hover:bg-[#ded6c4]'
                  }`}
                >
                  <span>{isSelected ? 'Plano Selecionado' : 'Selecionar Esta Cesta'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlan(plan);
                    onOpenCustomizer();
                  }}
                  className="w-full text-center text-xs text-[#52796f] hover:text-[#2f3e46] font-semibold underline underline-offset-4 py-1 cursor-pointer"
                >
                  Personalizar / Trocar Itens da Cesta
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
