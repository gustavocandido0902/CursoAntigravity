# Sistema de Gerenciamento de Almoxarifado (SGA)

Aplicação completa para gestão de estoque e movimentações de almoxarifado construída com **React (Vite)** e simulada com **json-server**.

---

## 🛠️ Tecnologias Utilizadas

- **Front-end**: React 19, Hooks (`useState`, `useEffect`, `useCallback`), CSS modular moderno.
- **Autenticação**: Controle de sessão via [frontend/src/services/auth.js](file:///c:/Users/Antigravity2/Documents/GustavoT/SGAlmoxarifado/frontend/src/services/auth.js) e interface de login com botões de atalho rápido.
- **Back-end Mock**: `json-server` consumindo [backend/db.json](file:///c:/Users/Antigravity2/Documents/GustavoT/SGAlmoxarifado/backend/db.json).
- **Variáveis de Ambiente**: Configurado via [frontend/.env](file:///c:/Users/Antigravity2/Documents/GustavoT/SGAlmoxarifado/frontend/.env).

---

## 🔐 Acesso e Autenticação

Para acessar o painel de gerenciamento de estoque, autentique-se na tela inicial:

- **Usuários cadastrados no sistema**:
  - `Carlos Silva` (Admin)
  - `Mariana Souza` (Operador)
  - `Roberto Santos` (Almoxarife)
- **Senha padrão (definida via .env)**: `admin`

---

## 🚀 Como Executar o Projeto

### 1. Iniciar o Mock da API (json-server)

No terminal raiz do projeto:

```bash
npm run server
# ou diretamente:
npx json-server --watch backend/db.json --port 3000
```

> A API REST estará disponível em: `http://localhost:3000`  
> Endpoints: `/produtos`, `/usuarios`, `/movimentacoes`

### 2. Iniciar a Aplicação React

Em outro terminal:

```bash
npm run frontend
# ou:
cd frontend
npm run dev
```

> A aplicação estará disponível em: `http://localhost:5174` (ou `5173`)

---

## 📦 Estrutura do Projeto

- [backend/db.json](file:///c:/Users/Antigravity2/Documents/GustavoT/SGAlmoxarifado/backend/db.json): Banco de dados mock com usuários, produtos (incluindo descrição técnica, foto em alta definição e categoria) e movimentações.
- [frontend/src/services/api.js](file:///c:/Users/Antigravity2/Documents/GustavoT/SGAlmoxarifado/frontend/src/services/api.js): Funções de integração HTTP com o json-server.
- [frontend/src/services/auth.js](file:///c:/Users/Antigravity2/Documents/GustavoT/SGAlmoxarifado/frontend/src/services/auth.js): Lógica de validação de credenciais e controle de sessão (`sessionStorage`).
- [frontend/src/components/Login/Login.jsx](file:///c:/Users/Antigravity2/Documents/GustavoT/SGAlmoxarifado/frontend/src/components/Login/Login.jsx): Tela de autenticação com atalhos de seleção rápida e visualização de senha.
- [frontend/src/components/ModalDetalhesProduto/ModalDetalhesProduto.jsx](file:///c:/Users/Antigravity2/Documents/GustavoT/SGAlmoxarifado/frontend/src/components/ModalDetalhesProduto/ModalDetalhesProduto.jsx): Painel modal com visualização da foto do produto, saldo em estoque, categoria, descrição técnica detalhada e botão para movimentação direta.
- [frontend/src/components/FormularioMovimentacao/FormularioMovimentacao.jsx](file:///c:/Users/Antigravity2/Documents/GustavoT/SGAlmoxarifado/frontend/src/components/FormularioMovimentacao/FormularioMovimentacao.jsx): Regras de negócio de entrada/saída, validação de saldo insuficiente e integração direta com produtos selecionados via modal.
- [frontend/src/components/ListaProdutos/ListaProdutos.jsx](file:///c:/Users/Antigravity2/Documents/GustavoT/SGAlmoxarifado/frontend/src/components/ListaProdutos/ListaProdutos.jsx): Tabela de inventário com miniaturas, busca dinâmica por nome/SKU/categoria e suporte a clique na linha para abrir o modal do produto.
- [frontend/src/components/HistoricoMovimentacoes/HistoricoMovimentacoes.jsx](file:///c:/Users/Antigravity2/Documents/GustavoT/SGAlmoxarifado/frontend/src/components/HistoricoMovimentacoes/HistoricoMovimentacoes.jsx): Log com as últimas transações realizadas.
- [frontend/src/App.jsx](file:///c:/Users/Antigravity2/Documents/GustavoT/SGAlmoxarifado/frontend/src/App.jsx): Painel gerencial unificado com proteção de acesso, dados do usuário ativo no cabeçalho e botão de logout.
