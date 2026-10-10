<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Dominio\Repositorios;

use AlmoxarifadoPro\Dominio\Entidades\Item;

/**
 * Contrato de persistência para consulta e atualização de itens.
 */
interface ItemRepositorioInterface
{
    public function buscarPorCodigo(string $codigo): ?Item;

    /**
     * @return Item[]
     */
    public function listarAbaixoDoEstoqueMinimo(): array;

    public function atualizarSaldo(string $itemId, float $novoSaldo): void;
}
