// Obtém a senha padrão configurada no ambiente (.env)
const SENHA_MESTRA = import.meta.env.VITE_DEFAULT_AUTH_PASSWORD || 'admin';
const CHAVE_SESSAO = 'sga_usuario_autenticado';

// Valida as credenciais comparando a senha e localizando o usuário
export function autenticar(identificador, senha, usuarios) {
  if (senha !== SENHA_MESTRA) {
    throw new Error('Senha incorreta. Tente novamente.');
  }

  const termo = identificador.trim().toLowerCase();
  const usuarioEncontrado = usuarios.find(
    (u) =>
      u.nome.toLowerCase() === termo ||
      String(u.id) === termo ||
      u.nome.toLowerCase().includes(termo)
  );

  if (!usuarioEncontrado) {
    throw new Error('Usuário não localizado no sistema.');
  }

  return usuarioEncontrado;
}

// Armazena os dados do usuário autenticado na sessão do navegador
export function salvarSessao(usuario) {
  sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario));
}

// Recupera o usuário atualmente autenticado na sessão
export function obterSessao() {
  const dados = sessionStorage.getItem(CHAVE_SESSAO);
  try {
    return dados ? JSON.parse(dados) : null;
  } catch {
    return null;
  }
}

// Remove os dados da sessão ao realizar logout
export function encerrarSessao() {
  sessionStorage.removeItem(CHAVE_SESSAO);
}
