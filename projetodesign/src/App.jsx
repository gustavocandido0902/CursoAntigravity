import React, { useState } from 'react';
import Header from './components/Header';
import PlanSelection from './components/ClientView/PlanSelection';
import BasketCustomizer from './components/ClientView/BasketCustomizer';
import AddressValidation from './components/ClientView/AddressValidation';
import PaymentForm from './components/ClientView/PaymentForm';
import OrderSuccessModal from './components/ClientView/OrderSuccessModal';
import DriverDashboard from './components/DriverView/DriverDashboard';
import { BASKET_PLANS, INITIAL_ORDERS, validateZonaSul } from './data/mockData';
import { Sprout, ShieldCheck, Heart, Leaf, Award, Recycle, Info } from 'lucide-react';

export default function App() {
  // Controle de Visualização Principal: 'client' | 'driver'
  const [activeView, setActiveView] = useState('client');

  // Estado do Plano e Itens
  const [selectedPlan, setSelectedPlan] = useState(BASKET_PLANS[1]); // Médio por padrão (R$ 80)
  const [customizedItems, setCustomizedItems] = useState(BASKET_PLANS[1].items);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  
  // Regra de Negócio 1: Troca de itens só permitida até domingo às 23:59h
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  // Regra de Negócio 2: Validação de Endereço na Zona Sul
  const [addressData, setAddressData] = useState({
    neighborhood: 'Ipanema',
    street: 'Rua Visconde de Pirajá, 350',
    complement: 'Apto 601',
    cep: '22410-002',
    deliveryNotes: 'Deixar na portaria com o Sr. Roberto'
  });

  // Estado dos Pedidos Compartilhado entre Cliente e Entregador
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [lastCreatedOrder, setLastCreatedOrder] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Atualiza os itens quando o plano muda
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setCustomizedItems(plan.items);
  };

  // Executa troca de item (se dentro do prazo)
  const handleSwapItem = (itemId, newName) => {
    if (isDeadlinePassed) return;
    setCustomizedItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, name: newName, isSwapped: true }
          : item
      )
    );
  };

  // Validação em tempo real do bairro informado
  const validationResult = validateZonaSul(addressData.neighborhood);
  const isAddressValid = validationResult.isValid;

  // Seleção rápida de bairros para teste pelos avaliadores
  const handleQuickSelectNeighborhood = (name) => {
    setAddressData((prev) => ({
      ...prev,
      neighborhood: name
    }));
  };

  // Simulação de confirmação do Pagamento Recorrente
  const handleSubmitPayment = (cardData) => {
    if (!isAddressValid) return;

    setIsProcessingPayment(true);
    setTimeout(() => {
      const newOrderId = `HNM-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = {
        id: newOrderId,
        customerName: cardData.holder || 'Assinante Horta-na-Mão',
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        planPrice: selectedPlan.price,
        address: `${addressData.street} - ${addressData.complement || ''}`,
        neighborhood: `${addressData.neighborhood} (Zona Sul)`,
        status: 'pending',
        createdAt: 'Agora mesmo',
        deliveryTimeSlot: 'Próxima Colheita',
        notes: addressData.deliveryNotes || 'Cesta semanal de orgânicos frescos',
        paymentMethod: `Cartão de Crédito Recorrente (•••• ${cardData.number.slice(-4)})`,
        photoUrl: null,
        deliveredAt: null,
        driverNotes: null
      };

      setOrders((prev) => [newOrder, ...prev]);
      setLastCreatedOrder(newOrder);
      setIsProcessingPayment(false);
      setIsSuccessModalOpen(true);
    }, 900);
  };

  // Ação do Entregador: Confirmação de Entrega com Foto
  const handleConfirmDelivery = (orderId, deliveryDetails) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: 'delivered',
              photoUrl: deliveryDetails.photoUrl,
              driverNotes: deliveryDetails.driverNotes,
              deliveredAt: deliveryDetails.deliveredAt
            }
          : order
      )
    );
  };

  const pendingDeliveriesCount = orders.filter((o) => o.status !== 'delivered').length;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c332d] flex flex-col font-sans selection:bg-[#c8e6c9] selection:text-[#1b4332]">
      {/* Cabeçalho com o Alternador de Visões */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        ordersCount={orders.length}
        pendingDeliveriesCount={pendingDeliveriesCount}
      />

      {/* Faixa Informativa de Contexto da Demonstração */}
      <div className="bg-[#ede7d9] border-b border-[#ded5c0] px-4 py-2.5 text-xs text-[#554f42]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#8a5a36] shrink-0" />
            <span>
              <strong>Protótipo Interativo Horta-na-Mão:</strong> Alterne no topo entre a <em>Visão do Cliente</em> (escolha de cesta e pagamento) e a <em>Visão do Entregador</em> (registro da foto na porta).
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px] font-semibold">
            <span className="text-emerald-800">🌱 Exclusivo Zona Sul</span>
            <span>•</span>
            <span className="text-[#bc6c25]">💳 Cartão Recorrente Exclusivo</span>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal conforme Visão Ativa */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeView === 'client' ? (
          <div className="space-y-10 animate-fadeIn">
            {/* 1. Seleção de Cestas e Preços (R$ 50, R$ 80, R$ 120) */}
            <section id="planos">
              <PlanSelection
                selectedPlan={selectedPlan}
                onSelectPlan={handleSelectPlan}
                onOpenCustomizer={() => setIsCustomizerOpen(true)}
              />
            </section>

            {/* Banner de Aviso de Regra de Negócio: Troca de Itens */}
            <div className="p-4 rounded-2xl bg-[#f4ede1] border border-[#dcd1bc] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800 font-bold shrink-0">
                  🗓️
                </span>
                <div>
                  <p className="font-bold text-[#1b3022]">
                    Regra Semanal: A troca de itens da cesta só é permitida até domingo às 23:59h.
                  </p>
                  <p className="text-[#656054]">
                    Após o prazo, as colheitas são reservadas com os agricultores familiares e o cardápio é travado.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCustomizerOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#2d5a37] hover:bg-[#23472b] text-white font-bold transition-all shrink-0 cursor-pointer shadow-sm"
              >
                Gerenciar / Trocar Itens
              </button>
            </div>

            {/* 2. Validação do Endereço de Entrega (Regra Zona Sul) */}
            <section id="endereco">
              <AddressValidation
                addressData={addressData}
                setAddressData={setAddressData}
                validationResult={validationResult}
                onQuickSelectNeighborhood={handleQuickSelectNeighborhood}
              />
            </section>

            {/* 3. Simulação de Pagamento Recorrente por Cartão de Crédito */}
            <section id="pagamento">
              <PaymentForm
                selectedPlan={selectedPlan}
                isAddressValid={isAddressValid}
                onSubmitPayment={handleSubmitPayment}
                isProcessing={isProcessingPayment}
              />
            </section>
          </div>
        ) : (
          /* Visão do Entregador */
          <div className="animate-fadeIn">
            <DriverDashboard
              orders={orders}
              onConfirmDelivery={handleConfirmDelivery}
              onSwitchToClientView={() => setActiveView('client')}
            />
          </div>
        )}
      </main>

      {/* Modal de Personalização e Troca de Itens com Regra de Domingo 23:59 */}
      <BasketCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        plan={selectedPlan}
        customizedItems={customizedItems}
        onSwapItem={handleSwapItem}
        isDeadlinePassed={isDeadlinePassed}
        setIsDeadlinePassed={setIsDeadlinePassed}
      />

      {/* Modal de Sucesso após Pagamento Recorrente */}
      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        order={lastCreatedOrder}
        onClose={() => setIsSuccessModalOpen(false)}
        onSwitchToDriverView={() => {
          setIsSuccessModalOpen(false);
          setActiveView('driver');
        }}
      />

      {/* Rodapé Institucional */}
      <footer className="mt-16 bg-[#24422b] text-[#d8f3dc] border-t border-[#1b3022] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#a7c957] text-[#1b3022] flex items-center justify-center font-bold">
                🌱
              </div>
              <span className="text-base font-bold text-white font-serif">Horta-na-Mão</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Conectando famílias urbanas da Zona Sul aos melhores pequenos produtores orgânicos e agroecológicos.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-[#a7c957]">Regras de Operação</h5>
            <ul className="space-y-1.5 text-stone-300">
              <li>• Trocas abertas até domingo 23:59h</li>
              <li>• Entregas exclusivas na Zona Sul</li>
              <li>• Comprovante fotográfico na porta</li>
              <li>• Cobrança recorrente transparente</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-[#a7c957]">Certificações & Selos</h5>
            <div className="space-y-1.5 text-stone-300">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#dda15e]" />
                <span>Orgânicos do Brasil Certificados</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Recycle className="w-3.5 h-3.5 text-[#a7c957]" />
                <span>Compensação de 100% das embalagens</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#dda15e]" />
                <span>PCI-DSS Proteção Recorrente</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-[#a7c957]">Suporte ao Assinante</h5>
            <p className="text-stone-300">
              Atendimento de segunda a sexta, das 08h às 18h.
            </p>
            <p className="text-[#dda15e] font-semibold">contato@hortanamao.com.br</p>
            <p className="text-stone-400 text-[10px]">© 2026 Horta-na-Mão Ltda. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
