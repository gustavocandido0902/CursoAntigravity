import React from 'react';
import { Sprout, ShoppingBag, Truck, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Header({ activeView, setActiveView, ordersCount, pendingDeliveriesCount }) {
  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e5dec9] transition-all">
      {/* Top Banner sustentabilidade */}
      <div className="bg-[#2d4739] text-[#e8f5e9] text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sprout className="w-3.5 h-3.5 text-[#a7c957]" />
        <span>100% Agroecológico • Colheita Local Familiar • Embalagens Biodegradáveis</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Marca */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#386641] to-[#24422b] text-white flex items-center justify-center shadow-md shadow-[#386641]/20 ring-2 ring-[#a7c957]/30">
            <Sprout className="w-6 h-6 text-[#a7c957]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1b3022] font-serif">
                Horta-na-Mão
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#e9f0e6] text-[#2d5a37] px-2 py-0.5 rounded-full border border-[#c2dabf]">
                Orgânicos
              </span>
            </div>
            <p className="text-xs text-[#6e7267] font-medium">
              Assinatura semanal de cestas agroecológicas direto do produtor
            </p>
          </div>
        </div>

        {/* Alternador de Visões: Cliente vs Entregador */}
        <div className="flex items-center bg-[#eae3d2] p-1.5 rounded-2xl border border-[#ded5c0] shadow-inner">
          <button
            onClick={() => setActiveView('client')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeView === 'client'
                ? 'bg-white text-[#1b3022] shadow-sm ring-1 ring-black/5 scale-[1.02]'
                : 'text-[#5a574f] hover:text-[#1b3022] hover:bg-[#dfd7c3]'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeView === 'client' ? 'bg-[#eaf3e8] text-[#2d5a37]' : 'text-stone-500'}`}>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span>Visão do Cliente</span>
          </button>

          <button
            onClick={() => setActiveView('driver')}
            className={`relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeView === 'driver'
                ? 'bg-[#2d4739] text-white shadow-sm ring-1 ring-black/5 scale-[1.02]'
                : 'text-[#5a574f] hover:text-[#1b3022] hover:bg-[#dfd7c3]'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeView === 'driver' ? 'bg-[#3e5f4d] text-[#a7c957]' : 'text-stone-500'}`}>
              <Truck className="w-4 h-4" />
            </div>
            <span>Visão do Entregador</span>

            {pendingDeliveriesCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-[#bc4749] text-white rounded-full animate-pulse shadow-sm">
                {pendingDeliveriesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
