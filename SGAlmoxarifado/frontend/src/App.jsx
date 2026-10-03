import React, { useState, useEffect, useCallback } from 'react';
import { buscarProdutos, buscarUsuarios, buscarMovimentacoes } from './services/api';
import { obterSessao, encerrarSessao } from './services/auth';
import { Login } from './components/Login/Login';
import { FormularioMovimentacao } from './components/FormularioMovimentacao/FormularioMovimentacao';
import { ListaProdutos } from './components/ListaProdutos/ListaProdutos';
import { HistoricoMovimentacoes } from './components/HistoricoMovimentacoes/HistoricoMovimentacoes';
import './App.css';

// Calcula os totais exibidos nos cartões de métricas rápidas
function calcularTotais(produtos, movimentacoes) {
  const totalItens = produtos.reduce((acc, p) => acc + (p.quantidade_estoque || 0), 0);
  const itensCriticos = produtos.filter((p) => p.quantidade_estoque <= 10).length;
  return { totalItens, totalTipos: produtos.length, itensCriticos, totalOps: movimentacoes.length };
}

export function App() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(obterSessao());
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [produtoPreSelecionado, setProdutoPreSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Sincroniza todos os estados com o json-server
  const sincronizarDados = useCallback(async () => {
    try {
      const [prods, users, movs] = await Promise.all([
        buscarProdutos(),
        buscarUsuarios(),
        buscarMovimentacoes(),
      ]);
      setProdutos(prods);
      setUsuarios(users);
      setMovimentacoes(movs);
    } catch (erro) {
      console.error('Falha ao sincronizar dados da API:', erro);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (usuarioAutenticado) sincronizarDados();
  }, [usuarioAutenticado, sincronizarDados]);

  // Finaliza a sessão atual do usuário
  function handleLogout() {
    encerrarSessao();
    setUsuarioAutenticado(null);
  }

  if (!usuarioAutenticado) {
    return <Login onLoginSucesso={(user) => setUsuarioAutenticado(user)} />;
  }

  const metricas = calcularTotais(produtos, movimentacoes);

  return (
    <div className="layout-app">
      <header className="cabecalho-principal">
        <div className="conteudo-cabecalho">
          <div className="logo-container">
            <span className="logo-icone">📦</span>
            <div>
              <h1 className="logo-titulo">SGA Almoxarifado</h1>
              <p className="logo-sub">Sistema de Controle de Estoque e Movimentação</p>
            </div>
          </div>

          <div className="painel-usuario-sessao">
            <div className="perfil-usuario">
              <span className="icone-avatar">👤</span>
              <div className="info-usuario">
                <span className="nome-usuario">{usuarioAutenticado.nome}</span>
                <span className="cargo-usuario">{usuarioAutenticado.cargo}</span>
              </div>
            </div>

            <button
              type="button"
              id="btn-recarregar"
              className="btn-atualizar"
              onClick={sincronizarDados}
              title="Atualizar dados da API"
            >
              ↻ Sincronizar
            </button>

            <button
              type="button"
              id="btn-sair"
              className="btn-logout"
              onClick={handleLogout}
              title="Encerrar sessão"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="conteudo-principal">
        <section className="grid-metricas">
          <div className="card-metrica">
            <span className="metrica-rotulo">Volume Total em Estoque</span>
            <span className="metrica-valor">{metricas.totalItens}</span>
            <span className="metrica-detalhe">unidades físicas</span>
          </div>
          <div className="card-metrica">
            <span className="metrica-rotulo">Produtos Cadastrados</span>
            <span className="metrica-valor">{metricas.totalTipos}</span>
            <span className="metrica-detalhe">SKUs distintos</span>
          </div>
          <div className="card-metrica metrica-alerta">
            <span className="metrica-rotulo">Estoque Baixo</span>
            <span className="metrica-valor">{metricas.itensCriticos}</span>
            <span className="metrica-detalhe">itens em nível crítico</span>
          </div>
          <div className="card-metrica">
            <span className="metrica-rotulo">Movimentações</span>
            <span className="metrica-valor">{metricas.totalOps}</span>
            <span className="metrica-detalhe">operações registradas</span>
          </div>
        </section>

        <section className="secao-formulario" id="secao-formulario-movimentacao">
          <FormularioMovimentacao
            onMovimentacaoConcluida={sincronizarDados}
            usuarioLogado={usuarioAutenticado}
            produtoPreSelecionado={produtoPreSelecionado}
          />
        </section>

        <section className="secao-listagens">
          <ListaProdutos
            produtos={produtos}
            carregando={carregando}
            onSelecionarParaMovimentar={(prod) => setProdutoPreSelecionado(prod)}
          />
          <HistoricoMovimentacoes
            movimentacoes={movimentacoes}
            produtos={produtos}
            usuarios={usuarios}
            carregando={carregando}
          />
        </section>
      </main>

      <footer className="rodape">
        <p>SGA Almoxarifado © 2026 — Desenvolvido com React & json-server</p>
      </footer>
    </div>
  );
}

export default App;
