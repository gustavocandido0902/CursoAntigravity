// Dados e Configurações da Horta-na-Mão

export const BASKET_PLANS = [
  {
    id: 'pequeno',
    name: 'Cesta Pequena',
    badge: 'Ideal para 1 a 2 pessoas',
    price: 50,
    frequency: '/ semana',
    billingNote: 'Cobrança semanal recorrente de R$ 50,00',
    description: 'Seleção compacta e versátil com os itens mais frescos da colheita semanal.',
    itemsCount: '6 a 7 variedades',
    serves: '1-2 pessoas',
    highlight: false,
    items: [
      { id: 'folha-1', name: 'Alface Crespa Orgânica', category: 'Folhosas', swappableWith: ['Alface Americana', 'Rúcula Selvagem'] },
      { id: 'folha-2', name: 'Couve Manteiga Fresca', category: 'Folhosas', swappableWith: ['Espinafre Orgânico', 'Acelga'] },
      { id: 'leg-1', name: 'Tomate Italiano Orgânico (600g)', category: 'Legumes', swappableWith: ['Tomate Cereja (400g)', 'Abobrinha Italiana'] },
      { id: 'leg-2', name: 'Cenoura Baby com Rama (500g)', category: 'Legumes', swappableWith: ['Beterraba Doce', 'Rabanete Francês'] },
      { id: 'fruta-1', name: 'Banana Prata Agroecológica (6 un)', category: 'Frutas', swappableWith: ['Mamão Papaia Orgânico', 'Laranja Lima (1kg)'] },
      { id: 'erva-1', name: 'Cheiro Verde Fresco (Salsa & Cebolinha)', category: 'Ervas e Temperos', swappableWith: ['Manjericão Basílico', 'Hortelã da Terra'] }
    ]
  },
  {
    id: 'medio',
    name: 'Cesta Média',
    badge: 'Mais Popular ⭐',
    price: 80,
    frequency: '/ semana',
    billingNote: 'Cobrança semanal recorrente de R$ 80,00',
    description: 'Equilíbrio perfeito de legumes, raízes, folhas e frutas para sua semana saudável.',
    itemsCount: '10 a 12 variedades',
    serves: '2-3 pessoas',
    highlight: true,
    items: [
      { id: 'folha-1', name: 'Alface Roxa e Crespa Orgânica', category: 'Folhosas', swappableWith: ['Mix de Folhas Baby', 'Rúcula Selvagem'] },
      { id: 'folha-2', name: 'Couve Manteiga & Espinafre', category: 'Folhosas', swappableWith: ['Agrião d\'Água', 'Acelga'] },
      { id: 'leg-1', name: 'Tomate Italiano e Débora (1kg)', category: 'Legumes', swappableWith: ['Tomate Grape Orgânico (700g)', 'Pimentão Amarelo'] },
      { id: 'leg-2', name: 'Cenoura com Rama e Beterraba (1kg)', category: 'Legumes', swappableWith: ['Mandioca Manteiga', 'Batata Doce Roxa'] },
      { id: 'leg-3', name: 'Abobrinha Italiana Orgânica (600g)', category: 'Legumes', swappableWith: ['Berinjela Rajada', 'Chuchu Paulista'] },
      { id: 'leg-4', name: 'Brócolis Ninja Orgânico (1 un)', category: 'Legumes', swappableWith: ['Couve-Flor Orgânica', 'Vagem Macarrão'] },
      { id: 'fruta-1', name: 'Banana Prata Orgânica (1 dúzia)', category: 'Frutas', swappableWith: ['Mamão Formosa Orgânico', 'Laranja Bahia'] },
      { id: 'fruta-2', name: 'Maçã Fuji Agroecológica (4 un)', category: 'Frutas', swappableWith: ['Manga Palmer Orgânica', 'Abacaxi Pérola'] },
      { id: 'erva-1', name: 'Manjericão da Terra & Alecrim Fresco', category: 'Ervas e Temperos', swappableWith: ['Coentro e Cebolinha', 'Tomilho Fresco'] },
      { id: 'extra-1', name: 'Gengibre Silvestre e Cúrcuma (200g)', category: 'Especiais', swappableWith: ['Alho Poró Inteiro', 'Pimenta de Cheiro'] }
    ]
  },
  {
    id: 'grande',
    name: 'Cesta Grande',
    badge: 'Fartura Completa 🌱',
    price: 120,
    frequency: '/ semana',
    billingNote: 'Cobrança semanal recorrente de R$ 120,00',
    description: 'A despensa viva completa para toda a família com ovos caipiras e super variedade.',
    itemsCount: '15 a 17 variedades + Ovos',
    serves: '4+ pessoas',
    highlight: false,
    items: [
      { id: 'folha-1', name: 'Trio de Alfaces: Lisa, Crespa e Roxa', category: 'Folhosas', swappableWith: ['Endívia e Escarola', 'Rúcula Especial'] },
      { id: 'folha-2', name: 'Couve Orgânica, Espinafre e Agrião', category: 'Folhosas', swappableWith: ['Acelga e Mostarda', 'Radicchio Italiano'] },
      { id: 'leg-1', name: 'Tomate Carmem e Italiano Selecionados (1.5kg)', category: 'Legumes', swappableWith: ['Mix de Tomates Rústicos', 'Berinjelas e Pimentões'] },
      { id: 'leg-2', name: 'Cenoura, Beterraba e Nabo Japonês (1.5kg)', category: 'Legumes', swappableWith: ['Batata Baroa (Mandioquinha)', 'Inhame Agroecológico'] },
      { id: 'leg-3', name: 'Abóbora Japonesa Kabocha Inteira', category: 'Legumes', swappableWith: ['Abóbora Moranga Mini', 'Batata Doce Orgânica (1.5kg)'] },
      { id: 'leg-4', name: 'Brócolis + Couve-Flor Orgânicos', category: 'Legumes', swappableWith: ['Aspargos Frescos', 'Alcachofra de Época'] },
      { id: 'leg-5', name: 'Vagem Holandesa e Ervilha Torta (500g)', category: 'Legumes', swappableWith: ['Milho Verde Espiga (4 un)', 'Quiabo Sem Baba'] },
      { id: 'fruta-1', name: 'Banana Prata e Maçã Gala (1.5kg)', category: 'Frutas', swappableWith: ['Maracujá Doce e Manga', 'Pera Williams'] },
      { id: 'fruta-2', name: 'Abacate Manteiga + Limão Siciliano Orgânico', category: 'Frutas', swappableWith: ['Mamão e Tangerina Ponkan', 'Goiaba Vermelha'] },
      { id: 'erva-1', name: 'Kit Aromático Gourmet: 4 Ervas Vivas no Vaso', category: 'Ervas e Temperos', swappableWith: ['Ervas Desidratadas da Fazenda', 'Chás Orgânicos Variados'] },
      { id: 'ovo-1', name: 'Ovos Caipiras de Galinhas Livres (1 dúzia)', category: 'Especiais', swappableWith: ['Mel Silvestre Puro 250g', 'Geleia Artesanal de Morango'] }
    ]
  }
];

// Lista consolidada de bairros oficiais da Zona Sul (atendimento exclusivo)
export const ZONA_SUL_NEIGHBORHOODS = [
  // Zona Sul - Rio de Janeiro
  'copacabana',
  'ipanema',
  'leblon',
  'botafogo',
  'flamengo',
  'gavea',
  'gávea',
  'jardim botanico',
  'jardim botânico',
  'lagoa',
  'humaita',
  'humaitá',
  'laranjeiras',
  'catete',
  'gloria',
  'glória',
  'urca',
  'cosme velho',
  'leme',
  'sao conrado',
  'são conrado',
  // Zona Sul - São Paulo
  'moema',
  'vila mariana',
  'brooklin',
  'campo belo',
  'santo amaro',
  'saude',
  'saúde',
  'ipiranga',
  'vila nova conceicao',
  'vila nova conceição',
  'chacara santo antonio',
  'chácara santo antônio',
  'chacara flora',
  'chácara flora',
  'planalto paulista',
  'mirandopolis',
  'mirandópolis',
  'jabaquara',
  'cursino',
  'morumbi',
  'granja julieta'
];

/**
 * Função de validação de bairro para Zona Sul
 */
export function validateZonaSul(neighborhood) {
  if (!neighborhood || typeof neighborhood !== 'string') {
    return { isValid: false, reason: 'Informe o bairro da sua residência.' };
  }

  const normalized = neighborhood
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (normalized.length < 3) {
    return { isValid: false, reason: 'Nome do bairro muito curto.' };
  }

  // Verifica se o texto digitado contém "zona sul" explicitamente
  if (normalized.includes('zona sul')) {
    return { isValid: true, matchedNeighborhood: neighborhood.trim() };
  }

  // Verifica match exato ou parcial na lista de bairros autorizados da Zona Sul
  const match = ZONA_SUL_NEIGHBORHOODS.find(bairro => {
    const normBairro = bairro.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalized === normBairro || normalized.includes(normBairro) || normBairro.includes(normalized);
  });

  if (match) {
    return {
      isValid: true,
      matchedNeighborhood: match.charAt(0).toUpperCase() + match.slice(1)
    };
  }

  return {
    isValid: false,
    reason: `O bairro "${neighborhood.trim()}" não pertence à Zona Sul. No momento atendemos exclusivamente a Zona Sul para garantir que os vegetais cheguem colhidos no mesmo dia.`
  };
}

// Bairros para testes rápidos pelos avaliadores
export const DEMO_NEIGHBORHOODS = [
  { name: 'Copacabana', type: 'valid', desc: 'Zona Sul (RJ)' },
  { name: 'Moema', type: 'valid', desc: 'Zona Sul (SP)' },
  { name: 'Ipanema', type: 'valid', desc: 'Zona Sul (RJ)' },
  { name: 'Vila Mariana', type: 'valid', desc: 'Zona Sul (SP)' },
  { name: 'Botafogo', type: 'valid', desc: 'Zona Sul (RJ)' },
  { name: 'Tijuca', type: 'invalid', desc: 'Zona Norte (Bloqueado)' },
  { name: 'Barra da Tijuca', type: 'invalid', desc: 'Zona Oeste (Bloqueado)' },
  { name: 'Centro', type: 'invalid', desc: 'Centro (Bloqueado)' }
];

// Pedidos iniciais simulados para a visão do entregador
export const INITIAL_ORDERS = [
  {
    id: 'HNM-7821',
    customerName: 'Beatriz Vasconcellos',
    planId: 'medio',
    planName: 'Cesta Média',
    planPrice: 80,
    address: 'Rua Visconde de Pirajá, 414 - Apto 802',
    neighborhood: 'Ipanema (Zona Sul)',
    status: 'pending',
    createdAt: 'Hoje às 07:30',
    deliveryTimeSlot: 'Manhã (08:00 - 12:00)',
    notes: 'Interfone 802. Pode deixar na portaria se eu não atender.',
    paymentMethod: 'Cartão de Crédito Recorrente (•••• 8920)',
    photoUrl: null,
    deliveredAt: null,
    driverNotes: null
  },
  {
    id: 'HNM-7819',
    customerName: 'Rodrigo Silveira Mendes',
    planId: 'grande',
    planName: 'Cesta Grande',
    planPrice: 120,
    address: 'Av. Rouxinol, 620 - Bloco B, Casa 4',
    neighborhood: 'Moema (Zona Sul)',
    status: 'in_transit',
    createdAt: 'Hoje às 07:15',
    deliveryTimeSlot: 'Manhã (08:00 - 12:00)',
    notes: 'Cuidado com o cachorro no portão, tocar campainha social.',
    paymentMethod: 'Cartão de Crédito Recorrente (•••• 4118)',
    photoUrl: null,
    deliveredAt: null,
    driverNotes: null
  },
  {
    id: 'HNM-7804',
    customerName: 'Camila Drummond',
    planId: 'pequeno',
    planName: 'Cesta Pequena',
    planPrice: 50,
    address: 'Rua Voluntários da Pátria, 128 - Apto 301',
    neighborhood: 'Botafogo (Zona Sul)',
    status: 'delivered',
    createdAt: 'Hoje às 06:50',
    deliveryTimeSlot: 'Primeira Rota (07:30 - 09:30)',
    notes: 'Portaria 24h.',
    paymentMethod: 'Cartão de Crédito Recorrente (•••• 3392)',
    photoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    deliveredAt: 'Hoje às 08:42',
    driverNotes: 'Entregue ao porteiro Sr. Manoel conforme instrução.'
  }
];

// Fotos simuladas de entrega na porta para teste com um clique
export const SAMPLE_DELIVERY_PHOTOS = [
  {
    title: 'Cesta Orgânica no Hall Residencial',
    url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=700&q=80',
    caption: 'Cesta fresca posicionada em frente à porta do apartamento'
  },
  {
    title: 'Cesta com Folhas Frescas na Soleira',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
    caption: 'Cesta na porta de entrada da residência'
  },
  {
    title: 'Entrega Segura na Portaria / Recepção',
    url: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=700&q=80',
    caption: 'Cesta identificada deixada na bancada de entregas'
  }
];
