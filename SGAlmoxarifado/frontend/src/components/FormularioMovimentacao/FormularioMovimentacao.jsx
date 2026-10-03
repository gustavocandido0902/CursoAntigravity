import React, { useState, useEffect } from 'react';
import {
  buscarProdutos,
  buscarUsuarios,
  criarMovimentacao,
  atualizarEstoqueProduto,
} from '../../services/api';
import './FormularioMovimentacao.css';

// Calcula o novo saldo de estoque somando na entrada ou subtraindo na saída
function calcularNovoEstoque(tipo, estoqueAtual, qtd) {
  return tipo === 'entrada' ? estoqueAtual + qtd : estoqueAtual - qtd;
}

// Valida a consistência da operação garantindo saldo disponível em saídas
function validarOperacao(tipo, estoqueAtual, qtd) {
  if (qtd <= 0) {
    return 'A quantidade deve ser maior que zero.';
  }
  if (tipo === 'saida' && qtd > estoqueAtual) {
    return `Estoque insuficiente! Saldo atual é de ${estoqueAtual} unidade(s).`;
  }
  return null;
}

export function FormularioMovimentacao({ onMovimentacaoConcluida, usuarioLogado, produtoPreSelecionado }) {
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [usuarioId, setUsuarioId] = useState(usuarioLogado ? String(usuarioLogado.id) : '');
  const [tipo, setTipo] = useState('entrada');
  const [quantidade, setQuantidade] = useState('');
  const [feedback, setFeedback] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);

  // Carrega os dados necessários para os menus suspensos
  useEffect(() => {
    Promise.all([buscarProdutos(), buscarUsuarios()])
      .then(([listaProdutos, listaUsuarios]) => {
        setProdutos(listaProdutos);
        setUsuarios(listaUsuarios);
        if (usuarioLogado?.id) {
          setUsuarioId(String(usuarioLogado.id));
        }
      })
      .catch(() => setFeedback({ tipo: 'erro', texto: 'Erro ao carregar dados.' }));
  }, [usuarioLogado]);

  // Aplica o produto selecionado vindo do modal de detalhes
  useEffect(() => {
    if (produtoPreSelecionado?.id) {
      setProdutoId(String(produtoPreSelecionado.id));
      const secao = document.getElementById('secao-formulario-movimentacao');
      if (secao) secao.scrollIntoView({ behavior: 'smooth' });
    }
  }, [produtoPreSelecionado]);

  // Reseta os campos do formulário para o estado inicial
  function limparCampos() {
    setProdutoId('');
    setUsuarioId(usuarioLogado ? String(usuarioLogado.id) : '');
    setQuantidade('');
    setTipo('entrada');
  }

  // Executa o fluxo de atualização: grava movimentação e atualiza estoque via PATCH
  async function executarProcessamento(produtoSelecionado, qtdNumerica) {
    const novoEstoque = calcularNovoEstoque(
      tipo,
      produtoSelecionado.quantidade_estoque,
      qtdNumerica
    );

    // Passo 1: Registra o histórico da movimentação no endpoint /movimentacoes
    await criarMovimentacao({
      produto_id: produtoId,
      usuario_id: usuarioId,
      tipo,
      quantidade_movimentada: qtdNumerica,
      data: new Date().toISOString(),
    });

    // Passo 2: Atualiza o saldo do produto no endpoint /produtos/:id
    await atualizarEstoqueProduto(produtoId, novoEstoque);

    setFeedback({ tipo: 'sucesso', texto: 'Movimentação realizada com sucesso!' });
    limparCampos();
    if (onMovimentacaoConcluida) onMovimentacaoConcluida();
  }

  // Submete e valida os dados fornecidos pelo usuário
  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback({ tipo: '', texto: '' });

    const produto = produtos.find((p) => String(p.id) === String(produtoId));
    if (!produto || !usuarioId) {
      return setFeedback({ tipo: 'erro', texto: 'Selecione produto e operador.' });
    }

    const erroValidacao = validarOperacao(tipo, produto.quantidade_estoque, Number(quantidade));
    if (erroValidacao) {
      return setFeedback({ tipo: 'erro', texto: erroValidacao });
    }

    try {
      setCarregando(true);
      await executarProcessamento(produto, Number(quantidade));
    } catch {
      setFeedback({ tipo: 'erro', texto: 'Erro ao processar movimentação.' });
    } finally {
      setCarregando(false);
    }
  }

  const produtoSelecionado = produtos.find((p) => String(p.id) === String(produtoId));

  return (
    <div className="card-formulario">
      <div className="card-header">
        <h2 className="card-titulo">Nova Movimentação</h2>
        <p className="card-subtitulo">Registre entradas ou saídas de itens do estoque</p>
      </div>

      {feedback.texto && (
        <div className={`alerta alerta-${feedback.tipo}`} id="alerta-feedback">
          {feedback.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-movimentacao">
        <div className="grid-campos">
          <div className="campo-grupo">
            <label htmlFor="select-produto">Produto *</label>
            <select
              id="select-produto"
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
              required
            >
              <option value="">Selecione um produto...</option>
              {produtos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome} ({item.sku}) - Estoque: {item.quantidade_estoque}
                </option>
              ))}
            </select>
          </div>

          <div className="campo-grupo">
            <label htmlFor="select-usuario">Operador Responsável *</label>
            <select
              id="select-usuario"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              required
            >
              <option value="">Selecione um operador...</option>
              {usuarios.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nome} ({user.cargo})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-campos">
          <div className="campo-grupo">
            <label htmlFor="select-tipo">Tipo de Movimentação *</label>
            <div className="tipo-botoes">
              <button
                type="button"
                id="btn-tipo-entrada"
                className={`btn-opcao ${tipo === 'entrada' ? 'ativo entrada' : ''}`}
                onClick={() => setTipo('entrada')}
              >
                + Entrada
              </button>
              <button
                type="button"
                id="btn-tipo-saida"
                className={`btn-opcao ${tipo === 'saida' ? 'ativo saida' : ''}`}
                onClick={() => setTipo('saida')}
              >
                - Saída
              </button>
            </div>
          </div>

          <div className="campo-grupo">
            <label htmlFor="input-quantidade">Quantidade *</label>
            <input
              id="input-quantidade"
              type="number"
              min="1"
              placeholder="Ex: 10"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              required
            />
          </div>
        </div>

        {produtoSelecionado && (
          <div className="resumo-previa">
            <span>Saldo Atual: <strong>{produtoSelecionado.quantidade_estoque}</strong></span>
            <span>Previsão Final: <strong>
              {quantidade && !isNaN(Number(quantidade))
                ? calcularNovoEstoque(tipo, produtoSelecionado.quantidade_estoque, Number(quantidade))
                : produtoSelecionado.quantidade_estoque}
            </strong></span>
          </div>
        )}

        <button
          type="submit"
          id="btn-confirmar-movimentacao"
          className="btn-submit"
          disabled={carregando}
        >
          {carregando ? 'Processando transação...' : 'Confirmar Movimentação'}
        </button>
      </form>
    </div>
  );
}
