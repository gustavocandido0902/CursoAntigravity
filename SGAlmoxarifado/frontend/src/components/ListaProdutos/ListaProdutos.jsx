import React, { useState } from 'react';
import { ModalDetalhesProduto } from '../ModalDetalhesProduto/ModalDetalhesProduto';
import './ListaProdutos.css';

// Determina o rótulo e a classe CSS do nível de estoque
function obterStatusEstoque(quantidade) {
  if (quantidade <= 10) {
    return { classe: 'status-critico', rotulo: 'Estoque Baixo' };
  }
  if (quantidade <= 30) {
    return { classe: 'status-alerta', rotulo: 'Atenção' };
  }
  return { classe: 'status-ok', rotulo: 'Normal' };
}

// Filtra a lista de produtos com base no termo de busca digitado
function filtrarProdutos(produtos, busca) {
  const termo = busca.trim().toLowerCase();
  if (!termo) return produtos;
  return produtos.filter(
    (item) =>
      item.nome.toLowerCase().includes(termo) ||
      item.sku.toLowerCase().includes(termo) ||
      (item.categoria && item.categoria.toLowerCase().includes(termo))
  );
}

export function ListaProdutos({ produtos, carregando, onSelecionarParaMovimentar }) {
  const [busca, setBusca] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const produtosFiltrados = filtrarProdutos(produtos, busca);

  return (
    <div className="card-lista-produtos">
      <div className="card-header-lista">
        <div>
          <h2 className="card-titulo">Itens em Estoque</h2>
          <p className="card-subtitulo">
            Total de {produtos.length} produtos cadastrados no almoxarifado
          </p>
        </div>

        <input
          type="text"
          id="input-busca-produto"
          className="input-busca"
          placeholder="Buscar por nome, SKU ou categoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="dica-interacao-tabela">
        <span>💡 Clique em qualquer item da tabela para visualizar a <strong>foto ampliada</strong> e a <strong>descrição técnica</strong>.</span>
      </div>

      {carregando ? (
        <div className="estado-vazio">Carregando estoque...</div>
      ) : produtosFiltrados.length === 0 ? (
        <div className="estado-vazio">Nenhum produto encontrado.</div>
      ) : (
        <div className="tabela-container">
          <table className="tabela-produtos">
            <thead>
              <tr>
                <th>Item</th>
                <th>SKU</th>
                <th>Categoria</th>
                <th className="texto-centro">Qtd Estoque</th>
                <th className="texto-centro">Status</th>
                <th className="texto-centro">Ação</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((item) => {
                const status = obterStatusEstoque(item.quantidade_estoque);
                return (
                  <tr
                    key={item.id}
                    className="linha-produto-clicavel"
                    onClick={() => setProdutoSelecionado(item)}
                    title="Clique para ver foto e detalhes"
                  >
                    <td className="col-nome-com-foto">
                      {item.imagem ? (
                        <img
                          src={item.imagem}
                          alt={item.nome}
                          className="miniatura-produto"
                          loading="lazy"
                        />
                      ) : (
                        <span className="miniatura-fallback">📦</span>
                      )}
                      <div className="nome-e-preview">
                        <span className="nome-principal">{item.nome}</span>
                        {item.descricao && (
                          <span className="preview-descricao">
                            {item.descricao.slice(0, 48)}...
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="col-sku">{item.sku}</td>
                    <td className="col-categoria">
                      <span className="badge-categoria">{item.categoria || 'Geral'}</span>
                    </td>
                    <td className="col-qtd texto-centro">
                      <strong>{item.quantidade_estoque}</strong>
                    </td>
                    <td className="texto-centro">
                      <span className={`badge-status ${status.classe}`}>
                        {status.rotulo}
                      </span>
                    </td>
                    <td className="texto-centro">
                      <button
                        type="button"
                        className="btn-ver-detalhes"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProdutoSelecionado(item);
                        }}
                      >
                        👁️ Ver
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {produtoSelecionado && (
        <ModalDetalhesProduto
          produto={produtoSelecionado}
          onFechar={() => setProdutoSelecionado(null)}
          onSelecionarParaMovimentar={onSelecionarParaMovimentar}
        />
      )}
    </div>
  );
}
