<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Infraestrutura\Repositorios;

use AlmoxarifadoPro\Dominio\Entidades\Item;
use AlmoxarifadoPro\Dominio\Repositorios\ItemRepositorioInterface;
use PDO;

/**
 * Repositório PDO para persistência de itens baseado na tabela products do schema.sql.
 */
class PdoItemRepositorio implements ItemRepositorioInterface
{
    public function __construct(
        private readonly PDO $pdo
    ) {
    }

    public function buscarPorCodigo(string $codigo): ?Item
    {
        $sql = 'SELECT id, sku, name, current_stock, min_stock_alert, unit_of_measure, is_active 
                FROM products 
                WHERE sku = :codigo AND is_active = true 
                LIMIT 1';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['codigo' => $codigo]);
        $registro = $stmt->fetch();

        return $registro ? $this->hidratarItem($registro) : null;
    }

    /**
     * @return Item[]
     */
    public function listarAbaixoDoEstoqueMinimo(): array
    {
        $sql = 'SELECT id, sku, name, current_stock, min_stock_alert, unit_of_measure, is_active 
                FROM products 
                WHERE is_active = true AND current_stock <= min_stock_alert 
                ORDER BY (min_stock_alert - current_stock) DESC';
        $stmt = $this->pdo->query($sql);
        $registros = $stmt->fetchAll();

        return array_map(fn (array $linha): Item => $this->hidratarItem($linha), $registros);
    }

    public function atualizarSaldo(string $itemId, float $novoSaldo): void
    {
        $sql = 'UPDATE products 
                SET current_stock = :saldo, updated_at = CURRENT_TIMESTAMP 
                WHERE id = :id';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'saldo' => $novoSaldo,
            'id' => $itemId,
        ]);
    }

    /**
     * @param array<string, mixed> $linha
     */
    private function hidratarItem(array $linha): Item
    {
        return new Item(
            id: (string) $linha['id'],
            codigo: (string) $linha['sku'],
            nome: (string) $linha['name'],
            saldoAtual: (float) $linha['current_stock'],
            estoqueMinimo: (float) $linha['min_stock_alert'],
            unidadeMedida: (string) ($linha['unit_of_measure'] ?? 'UN'),
            ativo: (bool) $linha['is_active']
        );
    }
}
