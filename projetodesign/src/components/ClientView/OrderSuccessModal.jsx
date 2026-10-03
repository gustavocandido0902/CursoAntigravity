import React from 'react';
import { CheckCircle2, Sprout, ArrowRight, Truck, Calendar, MapPin, CreditCard, ShieldCheck } from 'lucide-react';

export default function OrderSuccessModal({ order, isOpen, onClose, onSwitchToDriverView }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#faf8f5] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#ded5c0] space-y-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícone de Sucesso */}
        <div className="w-16 h-16 rounded-full bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center mx-auto shadow-inner ring-8 ring-[#2d5a37]/10 animate-bounce">
          <CheckCircle2 className="w-9 h-9 text-[#2d5a37]" />
        </div>

        {/* Título e Parabéns */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2d5a37] bg-[#eaf3e8] px-3 py-1 rounded-full border border-[#c1dec4]">
            Assinatura Ativada com Sucesso
          </span>
          <h3 className="text-2xl font-bold font-serif text-[#1b3022] pt-2">
            Bem-vindo(a) à Horta-na-Mão! 🌱
          </h3>
          <p className="text-xs text-[#525a53] max-w-sm mx-auto">
            Sua cesta de orgânicos da colheita semanal já entrou na rota de montagem dos produtores parceiros.
          </p>
        </div>

        {/* Detalhes do Pedido Gerado */}
        <div className="bg-white p-4 rounded-2xl border border-[#ded5c0] text-left space-y-2.5 text-xs">
          <div className="flex justify-between items-center border-b border-[#f0eae1] pb-2 font-semibold">
            <span className="text-[#6e7267]">Código do Pedido:</span>
            <span className="font-mono text-[#2d5a37] font-bold">{order.id}</span>
          </div>

          <div className="flex justify-between items-center text-[#343a40]">
            <span className="text-[#6e7267]">Plano Escolhido:</span>
            <span className="font-bold">{order.planName} (R$ {order.planPrice},00/sem)</span>
          </div>

          <div className="flex justify-between items-center text-[#343a40]">
            <span className="text-[#6e7267]">Região Validada:</span>
            <span className="font-bold text-emerald-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {order.neighborhood}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#343a40]">
            <span className="text-[#6e7267]">Endereço:</span>
            <span className="truncate max-w-[220px] font-medium">{order.address}</span>
          </div>

          <div className="flex justify-between items-center text-[#343a40]">
            <span className="text-[#6e7267]">Pagamento:</span>
            <span className="font-medium text-[#2d5a37] flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" />
              Cartão Recorrente Ativo
            </span>
          </div>
        </div>

        {/* Chamada para ação entre as duas visões */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={onSwitchToDriverView}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#2d4739] hover:bg-[#1f3329] text-white text-xs font-bold shadow-lg shadow-[#2d4739]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Truck className="w-4 h-4 text-[#a7c957]" />
            <span>Ver Pedido na Visão do Entregador (Simular Entrega com Foto)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#6e7267] hover:text-[#1b3022] font-semibold underline underline-offset-4 cursor-pointer"
          >
            Permanecer na Visão do Cliente
          </button>
        </div>
      </div>
    </div>
  );
}
