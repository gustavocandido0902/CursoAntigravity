import React from 'react';
import { MapPin, AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Navigation } from 'lucide-react';
import { DEMO_NEIGHBORHOODS } from '../../data/mockData';

export default function AddressValidation({
  addressData,
  setAddressData,
  validationResult,
  onQuickSelectNeighborhood
}) {
  const handleChange = (field, value) => {
    setAddressData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const isNeighborhoodFilled = addressData.neighborhood.trim().length > 0;
  const isBlocked = isNeighborhoodFilled && !validationResult.isValid;
  const isApproved = isNeighborhoodFilled && validationResult.isValid;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e5dec9] shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0eae1] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#eaf3e8] text-[#2d5a37]">
              <MapPin className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-[#1b3022]">Endereço de Entrega & Validação de Região</h3>
          </div>
          <p className="text-xs text-[#6e7267] mt-0.5">
            Entregas semanais no dia escolhido com rastreio e confirmação fotográfica.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-[#f8f6f0] border border-[#e2d8c3] text-[#554d3d]">
          <span className="w-2 h-2 rounded-full bg-[#2d5a37]" />
          <span>Exclusivo Zona Sul</span>
        </div>
      </div>

      {/* REGRA DE NEGÓCIO 2: BANNER DE RESULTADO DA VALIDAÇÃO */}
      {isBlocked && (
        <div className="p-4 rounded-2xl bg-[#fdf2f2] border-2 border-[#f87171] text-[#991b1b] flex items-start gap-3 animate-shake">
          <ShieldAlert className="w-6 h-6 text-[#dc2626] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-bold text-sm">
              🚫 Entrega Não Suportada Nesta Região! (Cadastro Bloqueado)
            </p>
            <p className="leading-relaxed">
              O bairro <strong>"{addressData.neighborhood}"</strong> não pertence à <strong>Zona Sul</strong>.
              Para manter o frescor absoluto e a colheita no mesmo dia da entrega, a <em>Horta-na-Mão</em> atende exclusivamente a Zona Sul. O prosseguimento para o pagamento está bloqueado.
            </p>
          </div>
        </div>
      )}

      {isApproved && (
        <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-[#86efac] text-[#166534] flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <p className="font-bold text-sm">
              ✅ Região Atendida com Sucesso! (Zona Sul Confirmada)
            </p>
            <p className="leading-relaxed text-[#14532d]">
              Excelente! O bairro <strong>{validationResult.matchedNeighborhood || addressData.neighborhood}</strong> conta com nossa rota semanal expressa e frete com pegada neutra de carbono.
            </p>
          </div>
        </div>
      )}

      {/* Formulário de Endereço */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Campo Bairro / Região (Elemento crítico da regra) */}
        <div className="sm:col-span-2 md:col-span-1 space-y-1.5">
          <label className="block text-xs font-bold text-[#2d3748] flex items-center justify-between">
            <span>Bairro (Exclusivo Zona Sul) *</span>
            {isApproved && <span className="text-[10px] text-emerald-600 font-bold">Válido</span>}
            {isBlocked && <span className="text-[10px] text-red-600 font-bold">Não Atendido</span>}
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ex: Copacabana, Ipanema, Moema..."
              value={addressData.neighborhood}
              onChange={(e) => handleChange('neighborhood', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all outline-none ${
                isBlocked
                  ? 'border-red-500 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-400'
                  : isApproved
                  ? 'border-emerald-500 bg-emerald-50/30 text-stone-900 focus:ring-2 focus:ring-emerald-400'
                  : 'border-[#ded5c0] bg-white focus:border-[#2d5a37] focus:ring-2 focus:ring-[#2d5a37]/10'
              }`}
            />
            <div className="absolute right-3 top-2.5">
              {isApproved && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {isBlocked && <AlertCircle className="w-4 h-4 text-red-600" />}
            </div>
          </div>
        </div>

        {/* Rua / Avenida */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-bold text-[#2d3748]">
            Endereço Completo (Rua / Av. e Número) *
          </label>
          <input
            type="text"
            placeholder="Ex: Av. Vieira Souto, 240 ou Rua Gaivota, 112"
            value={addressData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border border-[#ded5c0] bg-white focus:border-[#2d5a37] focus:ring-2 focus:ring-[#2d5a37]/10 outline-none transition-all"
          />
        </div>

        {/* Complemento */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#2d3748]">
            Complemento / Apto / Bloco
          </label>
          <input
            type="text"
            placeholder="Ex: Apto 704, Bloco 2"
            value={addressData.complement}
            onChange={(e) => handleChange('complement', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border border-[#ded5c0] bg-white focus:border-[#2d5a37] focus:ring-2 focus:ring-[#2d5a37]/10 outline-none transition-all"
          />
        </div>

        {/* CEP */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#2d3748]">
            CEP
          </label>
          <input
            type="text"
            placeholder="00000-000"
            value={addressData.cep}
            onChange={(e) => handleChange('cep', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border border-[#ded5c0] bg-white focus:border-[#2d5a37] focus:ring-2 focus:ring-[#2d5a37]/10 outline-none transition-all"
          />
        </div>

        {/* Instruções para o Entregador */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#2d3748]">
            Instrução para a Entrega
          </label>
          <input
            type="text"
            placeholder="Ex: Deixar na portaria ou interfone 302"
            value={addressData.deliveryNotes}
            onChange={(e) => handleChange('deliveryNotes', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border border-[#ded5c0] bg-white focus:border-[#2d5a37] focus:ring-2 focus:ring-[#2d5a37]/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* Bairros de Teste Rápido para Avaliação */}
      <div className="p-3.5 rounded-2xl bg-[#faf7ef] border border-[#e5decb] space-y-2">
        <div className="flex items-center justify-between text-[11px] text-[#635c4e]">
          <span className="font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#bc6c25]" />
            Testes Rápidos de Validação (Clique para preencher e validar a regra):
          </span>
          <span className="text-[10px] text-stone-500">Validação em tempo real</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {DEMO_NEIGHBORHOODS.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => onQuickSelectNeighborhood(item.name)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                item.type === 'valid'
                  ? 'bg-emerald-100/70 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300'
              }`}
            >
              <span>{item.name}</span>
              <span className="text-[10px] opacity-75">({item.desc})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
