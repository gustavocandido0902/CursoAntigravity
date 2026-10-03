import React, { useState } from 'react';
import { Truck, CheckCircle2, Clock, MapPin, Camera, User, FileText, ChevronRight, Sparkles, AlertCircle, Eye } from 'lucide-react';
import DeliveryCaptureModal from './DeliveryCaptureModal';

export default function DriverDashboard({
  orders,
  onConfirmDelivery,
  onSwitchToClientView
}) {
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'delivered'
  const [viewingPhotoOrder, setViewingPhotoOrder] = useState(null);

  const pendingOrders = orders.filter(o => o.status !== 'delivered');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  const filteredOrders = orders.filter(order => {
    if (filter === 'pending') return order.status !== 'delivered';
    if (filter === 'delivered') return order.status === 'delivered';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner do Entregador */}
      <div className="bg-gradient-to-r from-[#24422b] via-[#2d5a37] to-[#1b3022] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a7c957] bg-white/10 px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Painel de Rota Operacional
              </span>
              <span className="text-xs text-stone-300">Setor: Zona Sul</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif">
              Entregas do Ciclo de Colheita
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 max-w-xl leading-relaxed">
              Confirme a entrega de cada cesta orgânica registrando a foto na porta do assinante. O comprovante é enviado ao cliente em tempo real.
            </p>
          </div>

          {/* Cards de Métricas da Rota */}
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/10 shrink-0">
            <div className="px-4 py-2 text-center border-r border-white/10">
              <span className="text-2xl font-extrabold text-white">{orders.length}</span>
              <p className="text-[10px] text-stone-300 uppercase tracking-wider font-semibold">Total Cestas</p>
            </div>

            <div className="px-4 py-2 text-center border-r border-white/10">
              <span className="text-2xl font-extrabold text-[#dda15e]">{pendingOrders.length}</span>
              <p className="text-[10px] text-stone-300 uppercase tracking-wider font-semibold">Pendentes</p>
            </div>

            <div className="px-4 py-2 text-center">
              <span className="text-2xl font-extrabold text-[#a7c957]">{deliveredOrders.length}</span>
              <p className="text-[10px] text-stone-300 uppercase tracking-wider font-semibold">Entregues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Ações */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-[#eae3d2] p-1 rounded-xl border border-[#ded5c0]">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-[#1b3022] shadow-sm'
                : 'text-[#615d54] hover:text-[#1b3022]'
            }`}
          >
            Todas ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'pending'
                ? 'bg-[#bc6c25] text-white shadow-sm'
                : 'text-[#615d54] hover:text-[#1b3022]'
            }`}
          >
            Pendentes ({pendingOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('delivered')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'delivered'
                ? 'bg-[#2d5a37] text-white shadow-sm'
                : 'text-[#615d54] hover:text-[#1b3022]'
            }`}
          >
            Entregues com Foto ({deliveredOrders.length})
          </button>
        </div>

        <button
          type="button"
          onClick={onSwitchToClientView}
          className="text-xs text-[#2d5a37] hover:text-[#1b3022] font-bold flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#ded5c0] shadow-sm cursor-pointer"
        >
          <span>+ Simular Novo Pedido no Cliente</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Lista de Pedidos na Rota do Entregador */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOrders.map((order) => {
          const isDelivered = order.status === 'delivered';

          return (
            <div
              key={order.id}
              className={`rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between ${
                isDelivered
                  ? 'bg-white/90 border-[#c5e1a5] shadow-sm'
                  : 'bg-white border-[#e5dec9] shadow-md hover:shadow-lg'
              }`}
            >
              {/* Topo do Card de Pedido */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#2d5a37] bg-[#eaf3e8] px-2.5 py-0.5 rounded-lg border border-[#c1dec4]">
                        {order.id}
                      </span>
                      <span className="text-[11px] text-[#756f62]">
                        {order.createdAt}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#1b3022] pt-1">
                      {order.customerName}
                    </h4>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isDelivered ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#d8f3dc] text-[#1b4332] border border-[#95d5b2]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Entregue
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fff3cd] text-[#856404] border border-[#ffeeba]">
                        <Clock className="w-3.5 h-3.5" />
                        Pendente na Porta
                      </span>
                    )}
                  </div>
                </div>

                {/* Detalhes da Cesta e Endereço */}
                <div className="space-y-2 pt-2 border-t border-[#f0eae1] text-xs">
                  <div className="flex items-center justify-between bg-[#fbfaf6] p-2.5 rounded-xl border border-[#ece4d0]">
                    <span className="text-[#6e7267] font-medium">Cesta Selecionada:</span>
                    <span className="font-bold text-[#1b3022]">{order.planName} • R$ {order.planPrice},00</span>
                  </div>

                  <div className="flex items-start gap-2 text-[#3b433c]">
                    <MapPin className="w-4 h-4 text-[#2d5a37] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{order.address}</span>
                      <div className="text-[11px] text-[#2d5a37] font-bold">
                        {order.neighborhood}
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="text-[11px] bg-[#f8f6f0] p-2 rounded-lg text-[#554d3d] border border-[#e8dfcb]">
                      <strong>Instrução:</strong> {order.notes}
                    </div>
                  )}

                  {/* Se já foi entregue, exibe a foto do comprovante */}
                  {isDelivered && order.photoUrl && (
                    <div className="mt-3 p-3 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#166534] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Comprovante com Foto Salvo
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {order.deliveredAt}
                        </span>
                      </div>

                      <div className="relative rounded-xl overflow-hidden h-32 border border-[#86efac]">
                        <img
                          src={order.photoUrl}
                          alt="Foto da entrega na porta"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setViewingPhotoOrder(order)}
                          className="absolute inset-0 bg-black/30 hover:bg-black/40 flex items-center justify-center text-white text-xs font-bold gap-1.5 transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Ampliar Comprovante</span>
                        </button>
                      </div>

                      {order.driverNotes && (
                        <p className="text-[11px] text-[#14532d] italic">
                          "{order.driverNotes}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* REQUISITO: BOTÃO PARA SIMULAR UPLOAD/CAPTURA DE UMA FOTO DA CESTA NA PORTA DO CLIENTE */}
              <div className="pt-4 mt-2">
                {!isDelivered ? (
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForDelivery(order)}
                    className="w-full py-3 px-4 rounded-2xl bg-[#2d5a37] hover:bg-[#23472b] text-white text-xs font-bold shadow-md shadow-[#2d5a37]/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-lg"
                  >
                    <Camera className="w-4 h-4 text-[#a7c957]" />
                    <span>Capturar Foto da Cesta na Porta & Confirmar Entrega</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForDelivery(order)}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2d5a37] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-stone-200"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Atualizar / Tirar Nova Foto</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Captura de Foto da Cesta na Porta */}
      <DeliveryCaptureModal
        isOpen={!!selectedOrderForDelivery}
        order={selectedOrderForDelivery}
        onClose={() => setSelectedOrderForDelivery(null)}
        onConfirmDelivery={onConfirmDelivery}
      />

      {/* Modal de Visualização da Foto em Alta Resolução */}
      {viewingPhotoOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setViewingPhotoOrder(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-[#24422b] text-white flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold">Comprovante de Entrega - {viewingPhotoOrder.id}</h4>
                <p className="text-[11px] text-stone-300">{viewingPhotoOrder.address}</p>
              </div>
              <button
                onClick={() => setViewingPhotoOrder(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <img
              src={viewingPhotoOrder.photoUrl}
              alt="Comprovante de Entrega"
              className="w-full max-h-[70vh] object-cover"
            />
            <div className="p-4 bg-stone-50 text-xs text-stone-600 flex justify-between items-center">
              <span>Registrado às {viewingPhotoOrder.deliveredAt || '08:42'}</span>
              <span className="font-bold text-emerald-800">Zona Sul Confirmada</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
