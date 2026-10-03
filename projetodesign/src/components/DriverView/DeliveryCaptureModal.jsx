import React, { useState } from 'react';
import { Camera, Upload, CheckCircle2, X, MapPin, Clock, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { SAMPLE_DELIVERY_PHOTOS } from '../../data/mockData';

export default function DeliveryCaptureModal({
  isOpen,
  order,
  onClose,
  onConfirmDelivery
}) {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [driverNotes, setDriverNotes] = useState('Cesta fresca entregue com sucesso e conferida.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  // Upload de arquivo real do dispositivo ou câmera
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulação rápida com fotos de demonstração
  const handleSelectSamplePhoto = (url) => {
    setPhotoPreview(url);
  };

  const handleConfirm = () => {
    if (!photoPreview) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmDelivery(order.id, {
        photoUrl: photoPreview,
        driverNotes: driverNotes,
        deliveredAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#faf8f5] rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#ded5c0] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-5 bg-gradient-to-r from-[#24422b] to-[#1b3022] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#a7c957]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#a7c957] bg-white/10 px-2 py-0.5 rounded-full">
                Protocolo de Entrega Fotográfica
              </span>
              <h3 className="text-lg font-bold font-serif">Comprovante de Entrega na Porta</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informações da Entrega */}
        <div className="p-4 bg-[#f2ede0] border-b border-[#ded4bd] flex flex-col sm:flex-row justify-between gap-3 text-xs">
          <div>
            <span className="text-[#756f62] font-semibold">Cliente & Pedido:</span>
            <p className="font-bold text-[#1b3022] text-sm">{order.customerName} • <span className="font-mono text-[#2d5a37]">{order.id}</span></p>
            <p className="text-[#555045] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#2d5a37] shrink-0" />
              <span>{order.address} ({order.neighborhood})</span>
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-[#756f62] font-semibold">Plano da Cesta:</span>
            <p className="font-bold text-[#1b3022]">{order.planName}</p>
            <span className="inline-block mt-0.5 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
              {order.deliveryTimeSlot || 'Rota Zona Sul'}
            </span>
          </div>
        </div>

        {/* Conteúdo Principal: Captura / Upload da Foto */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* REQUISITO: BOTÃO PARA SIMULAR O UPLOAD/CAPTURA DE UMA FOTO DA CESTA NA PORTA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1b3022] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#2d5a37]" />
                Foto da Cesta na Porta do Cliente *
              </label>
              <span className="text-[11px] text-[#6e7267]">Obrigatório para conclusão</span>
            </div>

            {/* Pré-visualização da Foto Capturada com Carimbo de Data/Hora */}
            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#2d5a37] bg-stone-900 shadow-md">
                <img
                  src={photoPreview}
                  alt="Cesta na porta"
                  className="w-full h-64 object-cover object-center"
                />

                {/* Carimbo Digital de Comprovação */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 text-white text-[11px] font-mono space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#a7c957] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Horta-na-Mão Entregas
                    </span>
                    <span className="flex items-center gap-1 text-stone-200">
                      <Clock className="w-3 h-3" /> {currentTime}
                    </span>
                  </div>
                  <div className="text-stone-300 truncate">
                    GPS: Zona Sul • Ref: {order.address}
                  </div>
                </div>

                {/* Botão para trocar ou tirar outra foto */}
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-sm transition-all cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Trocar Foto</span>
                </button>
              </div>
            ) : (
              /* Área de Upload / Captura */
              <div className="border-2 border-dashed border-[#c5bba8] hover:border-[#2d5a37] rounded-2xl p-6 text-center bg-[#faf7f0] transition-colors space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#eaf3e8] text-[#2d5a37] flex items-center justify-center mx-auto shadow-inner">
                  <Camera className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#1b3022]">
                    Capture ou Carregue a Foto da Cesta
                  </p>
                  <p className="text-[11px] text-[#6e7267] max-w-xs mx-auto">
                    Tire uma foto nítida mostrando a cesta posicionada na entrada da residência ou portaria.
                  </p>
                </div>

                {/* Input nativo de arquivo / câmera */}
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2d5a37] hover:bg-[#23472b] text-white text-xs font-bold shadow-md cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Abrir Câmera / Carregar Arquivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Botões Rápidos para Simular a Foto com 1 Clique */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-[#6a6355] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#bc6c25]" />
                Ou use uma foto simulada da porta (1 clique para testar):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_DELIVERY_PHOTOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSamplePhoto(sample.url)}
                    className="p-2 rounded-xl border border-[#ded5c0] bg-white hover:border-[#2d5a37] hover:bg-[#f3f8f1] text-left transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <span className="text-[11px] font-bold text-[#2d5a37] leading-tight line-clamp-1">
                      📸 {sample.title}
                    </span>
                    <span className="text-[10px] text-stone-500 mt-1 line-clamp-1">
                      {sample.caption}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Observações do Entregador */}
          <div className="space-y-1.5 pt-2 border-t border-[#ded5c0]">
            <label className="block text-xs font-bold text-[#1b3022]">
              Notas do Entregador (Opcional)
            </label>
            <input
              type="text"
              value={driverNotes}
              onChange={(e) => setDriverNotes(e.target.value)}
              placeholder="Ex: Deixado com o porteiro Sr. Manoel na bancada"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border border-[#ded5c0] bg-white focus:border-[#2d5a37] focus:ring-2 focus:ring-[#2d5a37]/10 outline-none"
            />
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 bg-stone-100 border-t border-[#ded5c0] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6e7267] hover:text-[#1b3022] cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={!photoPreview || isSubmitting}
            onClick={handleConfirm}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer ${
              !photoPreview
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                : isSubmitting
                ? 'bg-[#1b3022] text-white opacity-80 cursor-wait'
                : 'bg-[#2d5a37] hover:bg-[#23472b] text-white shadow-[#2d5a37]/20 hover:shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <>
                <CheckCircle2 className="w-4 h-4 animate-spin text-[#a7c957]" />
                <span>Registrando Comprovante...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#a7c957]" />
                <span>Confirmar Entrega com Foto</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
