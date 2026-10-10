<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Aplicacao\CasosDeUso;

use AlmoxarifadoPro\Aplicacao\DTOs\SaldoItemDTO;
use AlmoxarifadoPro\Dominio\Entidades\Item;
use AlmoxarifadoPro\Dominio\Repositorios\ItemRepositorioInterface;

/**
 * Caso de uso responsável por listar itens em situação de alerta ou ruptura de estoque.
 */
class ListarItensAbaixoMinimoCasoDeUso
{
    public function __construct(
        private readonly ItemRepositorioInterface $itemRepositorio
    ) {
    }

    /**
     * @return SaldoItemDTO[]
     */
    public function executar(): array
    {
        $itens = $this->itemRepositorio->listarAbaixoDoEstoqueMinimo();

        return array_map(
            fn (Item $item): SaldoItemDTO => new SaldoItemDTO(
                itemCodigo: $item->obterCodigo(),
                nome: $item->obterNome(),
                saldoAtual: $item->obterSaldoAtual(),
                estoqueMinimo: $item->obterEstoqueMinimo(),
                unidadeMedida: $item->obterUnidadeMedida(),
                abaixoMinimo: true
            ),
            $itens
        );
    }
}
