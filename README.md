# Meu Curso Desenvolvimento com Antigravity

**Início:** 19/09/2026
**Local**: Escola SENAI Americana

# Módulo 1 - Introdução & Nivelamento

- Hardware, Software e Sistemas Operacionais

- Preparando o Ambiente de Desenvolvimento
    - VsCode: Editor de Texto / IDE;
    - Criação da WorkSpace;
    - Arquivos e Extensões;
    - Softwares de versionamento;
    > Versionamento: processo de registrar e gerenciar todas as alterações feitas nos arquivos de um projeto ao longo do tempo.
        - GIT : Versionamento local;
        - GitHub : Versionamento em nuvem;

    ### Configurando o GIT e o GitHub

    Cibectar Git ao GitHub, digitar o seguinte comando no bash/cmd:

    `git config --global user.name "gustavocandido0902"`
    `git config --global user.email "gustavo.candido0902@gmail.com"`

    confirmar com o comando:
    `git config --list`

    ### O Processo de Desenvolvimento

    **"Como um Software é Feito"**
    * Programar é dar ordens extremamente detalhadas e lógicas para o computador. É como escrever uma receita de bolo passo a passo.

    **Arquitetura Básica de um Software**

    * Front-End (A interface): É tudo que o usuário, vê, clica e interage.
    * Back-End (O Cérebro): É a cozinha do restaurante. recebe as requisições, processa de acordo com a lógica e devolve uma resposta para UI(User Interface).
    * Banco de dados (A memória): É onde guardamos as informações permanentes: Logins, senhas, históricos, mensagens...

    ```mermaid

    flowchart LR
        A[Front-End]
        B[Back-End]
        C[Banco de dados]

        A --> B
        B --> C
        C --> B
        B --> A

    ```
    ### Meu Primeiro Projeto Antigravity

    **O Contexto(O que vamos Construir)** 

    * Gerenciador de Tarefas: HTML, CSS, Java Script

    * O Prompt para o Antigravity:
    