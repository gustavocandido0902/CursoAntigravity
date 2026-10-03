import React, { useEffect, useState } from 'react';
import './ModalDetalhesProduto.css';

// Determina as propriedades visuais do badge de estoque
function obterBadgeEstoque(quantidade) {
  if (quantidade <= 10) {
    return { classe: 'status-critico', rotulo: 'Estoque Baixo' };
  }
  if (quantidade <= 30) {
    return { classe: 'status-alerta', rotulo: 'Atenção' };
  }
  return { classe: 'status-ok', rotulo: 'Normal' };
}

export function ModalDetalhesProduto({ produto, onFechar, onSelecionarParaMovimentar }) {
  const [erroImagem, setErroImagem] = useState(false);

  // Fecha o modal ao pressionar a tecla ESC
  useEffect(() => {
    function tratarKeyDown(evento) {
      if (evento.key === 'Escape') onFechar();
    }
    window.addEventListener('keydown', tratarKeyDown);
    return () => window.removeEventListener('keydown', tratarKeyDown);
  }, [onFechar]);

  if (!produto) return null;

  const status = obterBadgeEstoque(produto.quantidade_estoque);
  const placeholderFallback = '📦';

  return (
    <div className="modal-overlay" onClick={onFechar} id="modal-overlay-produto">
      <div
        className="modal-conteudo"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="btn-fechar-modal"
          onClick={onFechar}
          title="Fechar visualização"
          id="btn-fechar-modal"
        >
          ✕
        </button>

        <div className="modal-grid">
          <div className="modal-imagem-wrapper">
            {!erroImagem && produto.imagem ? (
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="modal-imagem-produto"
                onError={() => setErroImagem(true)}
              />
            ) : (
              <div className="modal-imagem-fallback">
                <span className="fallback-icone">{placeholderFallback}</span>
                <span className="fallback-texto">Imagem não disponível</span>
              </div>
            )}
            <span className="modal-categoria-flutuante">
              {produto.categoria || 'Geral'}
            </span>
          </div>

          <div className="modal-informacoes">
            <div className="modal-cabecalho">
              <span className="modal-sku">{produto.sku}</span>
              <h2 className="modal-titulo">{produto.nome}</h2>
            </div>

            <div className="modal-painel-status">
              <div className="info-saldo">
                <span className="label-saldo">Saldo em Estoque:</span>
                <span className="valor-saldo">{produto.quantidade_estoque} un.</span>
              </div>
              <span className={`badge-status ${status.classe}`}>
                {status.rotulo}
              </span>
            </div>

            <div className="modal-secao-descricao">
              <h3 className="subtitulo-descricao">Sobre este item:</h3>
              <p className="texto-descricao">
                {produto.descricao || 'Nenhuma descrição técnica cadastrada para este produto.'}
              </p>
            </div>

            <div className="modal-acoes">
              {onSelecionarParaMovimentar && (
                <button
                  type="button"
                  id="btn-movimentar-produto"
                  className="btn-acao-movimentar"
                  onClick={() => {
                    onSelecionarParaMovimentar(produto);
                    onFechar();
                  }}
                >
                  ⇄ Movimentar Este Produto
                </button>
              )}
              <button
                type="button"
                className="btn-acao-fechar"
                onClick={onFechar}
              >
                Voltar à Lista
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
