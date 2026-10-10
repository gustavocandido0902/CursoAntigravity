-- ============================================================================
-- ARQUITETURA DE BANCO DE DADOS RELACIONAL (POSTGRESQL 14+)
-- DOMÍNIO: SISTEMA INTEGRADO DE GESTÃO EMPRESARIAL E ESTOQUE (MULTI-TENANT)
-- PADRÃO DE NOMENCLATURA: snake_case | NORMALIZAÇÃO: 3FN (COM EXCEÇÕES JUSTIFICADAS)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CRIAÇÃO DE EXTENSÕES, FUNÇÕES E TRIGGERS
-- ----------------------------------------------------------------------------

-- Função genérica e reutilizável para atualização automática do campo updated_at
-- Respeita a regra de responsabilidade única (SOLID) e mantém escopo inferior a 20 linhas.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 2. CRIAÇÃO DE TIPOS E ENUMS
-- ----------------------------------------------------------------------------

-- Criação idempotente de tipos enumerados para garantir consistência e evitar valores inválidos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM ('admin', 'manager', 'operator', 'viewer');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status_enum') THEN
        CREATE TYPE user_status_enum AS ENUM ('active', 'inactive', 'suspended');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
        CREATE TYPE order_status_enum AS ENUM ('draft', 'pending_payment', 'paid', 'fulfilled', 'cancelled');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stock_movement_type_enum') THEN
        CREATE TYPE stock_movement_type_enum AS ENUM ('inbound', 'outbound', 'adjustment', 'transfer');
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 3. CRIAÇÃO DE TABELAS, CHAVES E CONSTRAINTS
-- ----------------------------------------------------------------------------

-- Tabela de isolamento de organizações (Multi-tenancy a nível de linha para aplicações SaaS/OLTP)
CREATE TABLE IF NOT EXISTS tenants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    corporate_name varchar(150) NOT NULL,
    trade_name varchar(150) NOT NULL,
    tax_id varchar(32) NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenants_tax_id UNIQUE (tax_id),
    CONSTRAINT chk_tenants_tax_id_not_empty CHECK (length(trim(tax_id)) >= 8)
);

-- Tabela de usuários vinculados ao tenant
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    full_name varchar(120) NOT NULL,
    email varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'operator',
    status user_status_enum NOT NULL DEFAULT 'active',
    -- Justificativa JSONB: configurações voláteis de interface e preferências que variam por usuário sem esquema fixo
    preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT uq_users_tenant_email UNIQUE (tenant_id, email),
    CONSTRAINT chk_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Tabela de clientes/parceiros comerciais
CREATE TABLE IF NOT EXISTS customers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    full_name varchar(150) NOT NULL,
    tax_id varchar(32),
    email varchar(255),
    phone varchar(30),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customers_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT uq_customers_tenant_tax_id UNIQUE (tenant_id, tax_id)
);

-- Tabela de categorias de produtos com suporte a hierarquia (auto-relacionamento)
CREATE TABLE IF NOT EXISTS product_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    parent_category_id uuid,
    code varchar(50) NOT NULL,
    name varchar(100) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_categories_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_categories_parent FOREIGN KEY (parent_category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
    CONSTRAINT uq_product_categories_tenant_code UNIQUE (tenant_id, code)
);

-- Tabela de produtos/itens cadastrados
CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    category_id uuid,
    sku varchar(64) NOT NULL,
    name varchar(180) NOT NULL,
    description text,
    unit_of_measure varchar(10) NOT NULL DEFAULT 'UN',
    unit_price numeric(12, 2) NOT NULL,
    cost_price numeric(12, 2) NOT NULL DEFAULT 0.00,
    -- Justificativa 3FN: current_stock é desnormalizado para consultas rápidas de alta concorrência em OLTP,
    -- sendo mantido sincronizado transacionalmente com a tabela stock_movements via aplicação/regras de negócio.
    current_stock numeric(12, 3) NOT NULL DEFAULT 0.000,
    min_stock_alert numeric(12, 3) NOT NULL DEFAULT 0.000,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
    CONSTRAINT uq_products_tenant_sku UNIQUE (tenant_id, sku),
    CONSTRAINT chk_products_unit_price CHECK (unit_price >= 0),
    CONSTRAINT chk_products_cost_price CHECK (cost_price >= 0)
);

-- Tabela de pedidos/transações comerciais
CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    customer_id uuid NOT NULL,
    user_id uuid NOT NULL,
    order_number bigint GENERATED BY DEFAULT AS IDENTITY,
    status order_status_enum NOT NULL DEFAULT 'draft',
    ordered_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subtotal_amount numeric(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount numeric(12, 2) NOT NULL DEFAULT 0.00,
    -- Justificativa 3FN: total_amount é mantido por desempenho analítico e integridade de fechamento contábil
    total_amount numeric(12, 2) NOT NULL DEFAULT 0.00,
    notes text,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT uq_orders_tenant_number UNIQUE (tenant_id, order_number),
    CONSTRAINT chk_orders_subtotal CHECK (subtotal_amount >= 0),
    CONSTRAINT chk_orders_discount CHECK (discount_amount >= 0),
    CONSTRAINT chk_orders_total CHECK (total_amount >= 0)
);

-- Tabela de itens do pedido (Relação N:N normalizada com preservação do preço histórico praticado)
CREATE TABLE IF NOT EXISTS order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity numeric(12, 3) NOT NULL,
    unit_price numeric(12, 2) NOT NULL,
    discount_amount numeric(12, 2) NOT NULL DEFAULT 0.00,
    total_price numeric(12, 2) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT uq_order_items_order_product UNIQUE (order_id, product_id),
    CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_order_items_unit_price CHECK (unit_price >= 0),
    CONSTRAINT chk_order_items_total_price CHECK (total_price >= 0)
);

-- Tabela de movimentações físicas de estoque (Kardex auditável e imutável)
CREATE TABLE IF NOT EXISTS stock_movements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    product_id uuid NOT NULL,
    user_id uuid NOT NULL,
    order_id uuid,
    movement_type stock_movement_type_enum NOT NULL,
    quantity numeric(12, 3) NOT NULL,
    unit_cost numeric(12, 2) NOT NULL DEFAULT 0.00,
    notes text,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_stock_movements_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_stock_movements_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT fk_stock_movements_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_stock_movements_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    CONSTRAINT chk_stock_movements_quantity CHECK (quantity > 0),
    CONSTRAINT chk_stock_movements_unit_cost CHECK (unit_cost >= 0)
);

-- Tabela de trilha de auditoria para segurança e conformidade operacional
CREATE TABLE IF NOT EXISTS audit_logs (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id uuid NOT NULL,
    user_id uuid,
    target_table varchar(64) NOT NULL,
    record_id uuid,
    operation varchar(16) NOT NULL,
    -- Justificativa JSONB: armazena deltas (old/new states) de estruturas de tabelas variáveis
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    ip_address inet,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_logs_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_audit_logs_operation CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'))
);

-- Associação de gatilhos para atualização de timestamp nas tabelas mutáveis
DROP TRIGGER IF EXISTS trg_tenants_updated_at ON tenants;
CREATE TRIGGER trg_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_customers_updated_at ON customers;
CREATE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_product_categories_updated_at ON product_categories;
CREATE TRIGGER trg_product_categories_updated_at
    BEFORE UPDATE ON product_categories
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- 4. CRIAÇÃO DE ÍNDICES
-- ----------------------------------------------------------------------------

-- Índices em chaves estrangeiras para otimização de junções (evitam bloqueios de tabela em ON DELETE)
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users (tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_tenant_id ON customers (tenant_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_tenant_id ON product_categories (tenant_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_id ON product_categories (parent_category_id);
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products (tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_id ON orders (tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_tenant_id ON stock_movements (tenant_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements (product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_order_id ON stock_movements (order_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_user_id ON stock_movements (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs (tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs (user_id);

-- Índices compostos e especializados para acelerar filtros frequentes em cenários de produção
CREATE INDEX IF NOT EXISTS idx_products_tenant_active_name ON products (tenant_id, is_active, name);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_status_date ON orders (tenant_id, status, ordered_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_date ON stock_movements (product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_record ON audit_logs (target_table, record_id);

-- Índice GIN para busca performática sobre chaves internas no campo JSONB de auditoria
CREATE INDEX IF NOT EXISTS idx_audit_logs_payload_gin ON audit_logs USING gin (payload);

-- ----------------------------------------------------------------------------
-- 5. INSERTS DE EXEMPLO (ILUSTRAÇÃO DO PADRÃO ESPERADO)
-- ----------------------------------------------------------------------------

-- Inserção de organização (Tenant)
INSERT INTO tenants (id, corporate_name, trade_name, tax_id, is_active)
VALUES (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Logística e Distribuição Global S.A.',
    'LogGlobal',
    '12.345.678/0001-90',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Inserção de usuário (Hash argon2/bcrypt simulado; nunca armazena senha em texto puro)
INSERT INTO users (id, tenant_id, full_name, email, password_hash, role, status, preferences)
VALUES (
    '22222222-2222-2222-2222-222222222222'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Carlos Silva',
    'carlos.silva@logglobal.com',
    '$2a$12$e8xL4k4aQvK3KxYz0B4C8uYhO9H2K1WzD4F5G6H7J8K9L0M1N2O3P',
    'admin',
    'active',
    '{"theme": "dark", "locale": "pt_BR", "notifications_enabled": true}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Inserção de cliente
INSERT INTO customers (id, tenant_id, full_name, tax_id, email, phone, is_active)
VALUES (
    '33333333-3333-3333-3333-333333333333'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Indústria Metalúrgica Paulista Ltda',
    '98.765.432/0001-10',
    'compras@metalurgica.com.br',
    '+55 11 98888-7777',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Inserção de categoria de produto
INSERT INTO product_categories (id, tenant_id, parent_category_id, code, name)
VALUES (
    '44444444-4444-4444-4444-444444444444'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    NULL,
    'CAT-FERRAMENTAS',
    'Ferramentas Industriais'
)
ON CONFLICT (id) DO NOTHING;

-- Inserção de produto
INSERT INTO products (
    id, tenant_id, category_id, sku, name, description,
    unit_of_measure, unit_price, cost_price, current_stock, min_stock_alert, is_active
)
VALUES (
    '55555555-5555-5555-5555-555555555555'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    '44444444-4444-4444-4444-444444444444'::uuid,
    'SKU-TORQ-850W',
    'Chave de Impacto Pneumática 850W',
    'Equipamento industrial de alto torque para linha de montagem',
    'UN',
    1250.00,
    780.50,
    50.000,
    10.000,
    true
)
ON CONFLICT (id) DO NOTHING;

-- Inserção de pedido comercial
INSERT INTO orders (
    id, tenant_id, customer_id, user_id, status,
    subtotal_amount, discount_amount, total_amount, notes
)
VALUES (
    '66666666-6666-6666-6666-666666666666'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    '33333333-3333-3333-3333-333333333333'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    'paid',
    2500.00,
    100.00,
    2400.00,
    'Entrega prioritária autorizada pelo setor financeiro'
)
ON CONFLICT (id) DO NOTHING;

-- Inserção de item do pedido
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, discount_amount, total_price)
VALUES (
    '77777777-7777-7777-7777-777777777777'::uuid,
    '66666666-6666-6666-6666-666666666666'::uuid,
    '55555555-5555-5555-5555-555555555555'::uuid,
    2.000,
    1250.00,
    100.00,
    2400.00
)
ON CONFLICT (id) DO NOTHING;

-- Inserção de movimentação de estoque relacionada à expedição do pedido
INSERT INTO stock_movements (
    id, tenant_id, product_id, user_id, order_id,
    movement_type, quantity, unit_cost, notes
)
VALUES (
    '88888888-8888-8888-8888-888888888888'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    '55555555-5555-5555-5555-555555555555'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    '66666666-6666-6666-6666-666666666666'::uuid,
    'outbound',
    2.000,
    780.50,
    'Baixa referente à expedição do pedido de venda'
)
ON CONFLICT (id) DO NOTHING;

-- Inserção de registro de auditoria documentando o evento
INSERT INTO audit_logs (
    tenant_id, user_id, target_table, record_id,
    operation, payload, ip_address
)
VALUES (
    '11111111-1111-1111-1111-111111111111'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    'orders',
    '66666666-6666-6666-6666-666666666666'::uuid,
    'UPDATE',
    '{"old_status": "pending_payment", "new_status": "paid", "reason": "Webhook de liquidação bancária"}'::jsonb,
    '192.168.1.100'::inet
);
