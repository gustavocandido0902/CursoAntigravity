# AlmoxarifadoPro — Arquitetura de Dados Relacional

Este repositório contém o modelo relacional e DDL de banco de dados para um sistema integrado de gestão empresarial e almoxarifado/estoque multi-tenant, desenvolvido para **PostgreSQL 14+**.

O script completo de criação está disponível em [schema.sql](file:///c:/Users/Antigravity2/Documents/GustavoT/AlmoxarifadoPro/schema.sql).

---

## Diagrama Entidade-Relacionamento (ERD)

O diagrama a seguir descreve a estrutura relacional, chaves primárias (`PK`), estrangeiras (`FK`), atributos únicos (`UK`) e cardinalidades entre as entidades.

```mermaid
erDiagram
    tenants ||--o{ users : "possui"
    tenants ||--o{ customers : "possui"
    tenants ||--o{ product_categories : "possui"
    tenants ||--o{ products : "possui"
    tenants ||--o{ orders : "possui"
    tenants ||--o{ stock_movements : "possui"
    tenants ||--o{ audit_logs : "possui"

    product_categories |o--o{ product_categories : "auto_relacionamento"
    product_categories ||--o{ products : "categoriza"

    customers ||--o{ orders : "realiza"
    users ||--o{ orders : "gerencia"
    users ||--o{ stock_movements : "opera"
    users |o--o{ audit_logs : "autor_de"

    orders ||--|{ order_items : "contem"
    products ||--o{ order_items : "item_de"

    products ||--o{ stock_movements : "movimentado_em"
    orders |o--o{ stock_movements : "origina"

    tenants {
        uuid id PK
        varchar corporate_name
        varchar trade_name
        varchar tax_id UK
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    users {
        uuid id PK
        uuid tenant_id FK
        varchar full_name
        varchar email
        varchar password_hash
        user_role_enum role
        user_status_enum status
        jsonb preferences
        timestamptz created_at
        timestamptz updated_at
    }

    customers {
        uuid id PK
        uuid tenant_id FK
        varchar full_name
        varchar tax_id UK
        varchar email
        varchar phone
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    product_categories {
        uuid id PK
        uuid tenant_id FK
        uuid parent_category_id FK
        varchar code UK
        varchar name
        timestamptz created_at
        timestamptz updated_at
    }

    products {
        uuid id PK
        uuid tenant_id FK
        uuid category_id FK
        varchar sku UK
        varchar name
        text description
        varchar unit_of_measure
        numeric unit_price
        numeric cost_price
        numeric current_stock
        numeric min_stock_alert
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    orders {
        uuid id PK
        uuid tenant_id FK
        uuid customer_id FK
        uuid user_id FK
        bigint order_number UK
        order_status_enum status
        timestamptz ordered_at
        numeric subtotal_amount
        numeric discount_amount
        numeric total_amount
        text notes
        timestamptz created_at
        timestamptz updated_at
    }

    order_items {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        numeric quantity
        numeric unit_price
        numeric discount_amount
        numeric total_price
        timestamptz created_at
    }

    stock_movements {
        uuid id PK
        uuid tenant_id FK
        uuid product_id FK
        uuid user_id FK
        uuid order_id FK
        stock_movement_type_enum movement_type
        numeric quantity
        numeric unit_cost
        text notes
        timestamptz created_at
    }

    audit_logs {
        bigint id PK
        uuid tenant_id FK
        uuid user_id FK
        varchar target_table
        uuid record_id
        varchar operation
        jsonb payload
        inet ip_address
        timestamptz created_at
    }
```

---

## Estrutura e Papel das Entidades

| Entidade | Descrição |
| :--- | :--- |
| `tenants` | Isolamento lógico multi-tenant por organização/empresa. Garante que dados de diferentes empresas permaneçam segregados. |
| `users` | Usuários do sistema, com perfis (`user_role_enum`), status (`user_status_enum`), credenciais com hash seguro e preferências em `jsonb`. |
| `customers` | Clientes ou parceiros comerciais atendidos pelas operações da empresa. |
| `product_categories` | Categorização hierárquica (auto-referência `parent_category_id`) para organização de itens e produtos. |
| `products` | Catálogo de itens do almoxarifado/venda, com controle de unidade, precificação, custo e parâmetros de reposição. |
| `orders` | Cabeçalho de pedidos de venda/ordens com identificador amigável (`order_number`), cliente, operador e valores. |
| `order_items` | Detalhamento dos itens do pedido com histórico congelado do preço unitário aplicado no momento da venda. |
| `stock_movements` | Histórico (Kardex) auditável de todas as movimentações físicas (entradas, saídas, ajustes, transferências). |
| `audit_logs` | Trilha de auditoria para operações de escrita (`INSERT`, `UPDATE`, `DELETE`) e autenticação, com diffs em `jsonb`. |

---

## Decisões Arquiteturais e Boas Práticas

1. **Chaves Primárias e Integridade:**
   - Utilização de `uuid` gerados nativamente por `gen_random_uuid()` no PostgreSQL 14+, prevenindo enumeração sequencial e facilitando replicação e arquiteturas distribuídas.
   - Chave `bigint GENERATED ALWAYS AS IDENTITY` utilizada no log de auditoria e sequencial legível no número de pedido (`order_number`).
2. **Normalização (3FN) e Desnormalizações Controladas:**
   - `products.current_stock`: Mantido como saldo materializado para leituras de alto throughput em sistemas OLTP, sendo sincronizado estritamente pelas movimentações em `stock_movements`.
   - `orders.total_amount`: Mantido para consultas agregadas e fechamento contábil rápido.
3. **Tipagem e Precisão:**
   - Valores monetários e quantitativos modelados com `numeric` para evitar erros de ponto flutuante.
   - Timestamps definidos com `timestamptz` para preservar o fuso horário correto.
   - `jsonb` restrito a atributos com esquema flexível (`preferences`, `audit_logs.payload`).
4. **Indexação:**
   - Todas as chaves estrangeiras (`FK`) indexadas para acelerar junções e evitar gargalos de locks em exclusões em cascata.
   - Índices compostos cobrindo filtros de alta frequência e índice `GIN` para busca rápida nos metadados de auditoria.

---

## Execução

Para provisionar o banco de dados localmente ou via pipeline de CI/CD:

```bash
psql -h <host> -U <usuario> -d <nome_do_banco> -f schema.sql
```
