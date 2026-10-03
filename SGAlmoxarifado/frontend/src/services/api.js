// Obtém a URL base da API a partir das variáveis de ambiente do Vite
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Função utilitária genérica para centralizar requisições HTTP
async function requisicao(endpoint, options = {}) {
  const resposta = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!resposta.ok) {
    throw new Error(`Erro na chamada ${endpoint}: status ${resposta.status}`);
  }

  return resposta.json();
}

// Busca todos os produtos cadastrados no almoxarifado
export function buscarProdutos() {
  return requisicao('/produtos');
}

// Busca os dados de um produto específico através de seu identificador
export function buscarProdutoPorId(id) {
  return requisicao(`/produtos/${id}`);
}

// Atualiza parcialmente a quantidade em estoque de um produto existente
export function atualizarEstoqueProduto(id, novaQuantidade) {
  return requisicao(`/produtos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantidade_estoque: novaQuantidade }),
  });
}

// Busca todos os usuários cadastrados
export function buscarUsuarios() {
  return requisicao('/usuarios');
}

// Busca o histórico de movimentações cadastradas
export function buscarMovimentacoes() {
  return requisicao('/movimentacoes');
}

// Cria um novo registro de movimentação de entrada ou saída
export function criarMovimentacao(dados) {
  return requisicao('/movimentacoes', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}
