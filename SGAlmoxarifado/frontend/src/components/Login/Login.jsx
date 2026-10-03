import React, { useState, useEffect } from 'react';
import { buscarUsuarios } from '../../services/api';
import { autenticar, salvarSessao } from '../../services/auth';
import './Login.css';

export function Login({ onLoginSucesso }) {
  const [usuarios, setUsuarios] = useState([]);
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Carrega a lista de operadores cadastrados para facilitar o login
  useEffect(() => {
    buscarUsuarios()
      .then((lista) => setUsuarios(lista))
      .catch(() => setErro('Não foi possível carregar a lista de usuários da API.'));
  }, []);

  // Seleciona rapidamente um usuário através dos botões de atalho
  function selecionarAtalho(nome) {
    setIdentificador(nome);
    setErro('');
  }

  // Processa a validação de credenciais e inicializa a sessão
  function handleSubmit(event) {
    event.preventDefault();
    setErro('');

    if (!identificador.trim() || !senha) {
      return setErro('Preencha o usuário e a senha.');
    }

    try {
      setCarregando(true);
      const usuarioLogado = autenticar(identificador, senha, usuarios);
      salvarSessao(usuarioLogado);
      onLoginSucesso(usuarioLogado);
    } catch (err) {
      setErro(err.message || 'Falha na autenticação.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-cabecalho">
          <div className="login-logo-icone">🔐</div>
          <h1 className="login-titulo">Acesso ao SGA</h1>
          <p className="login-subtitulo">
            Entre com suas credenciais para gerenciar o almoxarifado
          </p>
        </div>

        {erro && <div className="alerta-login-erro">{erro}</div>}

        <form onSubmit={handleSubmit} className="form-login">
          <div className="campo-login">
            <label htmlFor="input-identificador">Usuário / Operador</label>
            <input
              id="input-identificador"
              type="text"
              placeholder="Digite seu nome (ex: Carlos Silva)"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              required
            />
          </div>

          {usuarios.length > 0 && (
            <div className="atalhos-usuarios">
              <span className="atalhos-label">Acesso rápido:</span>
              <div className="lista-tags-usuarios">
                {usuarios.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className={`tag-usuario ${identificador === u.nome ? 'selecionado' : ''}`}
                    onClick={() => selecionarAtalho(u.nome)}
                  >
                    {u.nome} ({u.cargo})
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="campo-login">
            <label htmlFor="input-senha">Senha de Acesso</label>
            <div className="input-senha-wrapper">
              <input
                id="input-senha"
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Senha padrão: admin"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn-toggle-senha"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                title={mostrarSenha ? 'Ocultar senha' : 'Ver senha'}
              >
                {mostrarSenha ? '👁️' : '🔒'}
              </button>
            </div>
            <span className="dica-senha">Dica: a senha padrão de demonstração é <strong>admin</strong></span>
          </div>

          <button
            type="submit"
            id="btn-entrar"
            className="btn-login-submit"
            disabled={carregando}
          >
            {carregando ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}
