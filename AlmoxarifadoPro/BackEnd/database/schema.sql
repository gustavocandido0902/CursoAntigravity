-- database/schema.sql
-- ============================================================================
-- ALMOXARIFADOPRO - METALÚRGICA VALE DO AÇO S/A
-- SCRIPT DDL DE PERSISTÊNCIA RELACIONAL (POSTGRESQL 14+)
-- BASEADO E COMPATÍVEL COM O SCHEMA PRINCIPAL (schema.sql)
-- ============================================================================

-- Habilitar extensão para geração segura de identificadores UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de produtos e materiais do almoxarifado (baseada em schema.sql)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    category_id UUID,
    sku VARCHAR(64) NOT NULL,
    name VARCHAR(180) NOT NULL,
    description TEXT,
    unit_of_measure VARCHAR(10) NOT NULL DEFAULT 'UN',
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    current_stock NUMERIC(12, 3) NOT NULL DEFAULT 0.000,
    min_stock_alert NUMERIC(12, 3) NOT NULL DEFAULT 0.000,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_products_sku UNIQUE (sku),
    CONSTRAINT chk_products_current_stock_positive CHECK (current_stock >= 0)
);

-- Tabela de movimentações físicas de estoque com rastreabilidade industrial
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    product_id UUID NOT NULL,
    user_id UUID,
    order_id UUID,
    movement_type VARCHAR(20) NOT NULL,
    quantity NUMERIC(12, 3) NOT NULL,
    unit_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tecnico_matricula VARCHAR(32),
    turno VARCHAR(1),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_stock_movements_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT chk_stock_movements_quantity CHECK (quantity > 0),
    CONSTRAINT chk_stock_movements_turno CHECK (turno IS NULL OR turno IN ('A', 'B', 'C')),
    CONSTRAINT chk_stock_movements_tipo CHECK (movement_type IN ('retirada', 'reposicao', 'inbound', 'outbound'))
);

-- Garantir compatibilidade e colunas de rastreabilidade se a tabela já existir previamente
ALTER TABLE products ALTER COLUMN tenant_id DROP NOT NULL;
ALTER TABLE stock_movements ALTER COLUMN tenant_id DROP NOT NULL;
ALTER TABLE stock_movements ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE stock_movements ALTER COLUMN movement_type TYPE VARCHAR(20);
ALTER TABLE stock_movements ADD COLUMN IF NOT EXISTS tecnico_matricula VARCHAR(32);
ALTER TABLE stock_movements ADD COLUMN IF NOT EXISTS turno VARCHAR(1);
CREATE UNIQUE INDEX IF NOT EXISTS uq_products_sku_idx ON products (sku);

-- Índices otimizados para consultas de estoque, técnico e turno
CREATE INDEX IF NOT EXISTS idx_products_sku_active ON products (sku, is_active);
CREATE INDEX IF NOT EXISTS idx_products_min_alert ON products (is_active, current_stock, min_stock_alert);
CREATE INDEX IF NOT EXISTS idx_movements_tecnico ON stock_movements (tecnico_matricula);
CREATE INDEX IF NOT EXISTS idx_movements_turno ON stock_movements (turno);
CREATE INDEX IF NOT EXISTS idx_movements_product_date ON stock_movements (product_id, created_at DESC);

-- Carga inicial de dados representativos da Metalúrgica Vale do Aço S/A
INSERT INTO products (sku, name, unit_of_measure, unit_price, current_stock, min_stock_alert, is_active)
VALUES 
    ('BRO-0042', 'Broca Diamantada 10mm Aço Rápido', 'UN', 145.50, 15.000, 5.000, true),
    ('EPI-0012', 'Óculos de Proteção Ampla Visão', 'UN', 28.00, 3.000, 10.000, true),
    ('ROL-2034', 'Rolamento Autocompensador de Esferas', 'UN', 310.00, 2.000, 8.000, true),
    ('DIS-0911', 'Disco de Corte Refratário 7 Pol', 'UN', 19.90, 45.000, 20.000, true)
ON CONFLICT (sku) DO NOTHING;
