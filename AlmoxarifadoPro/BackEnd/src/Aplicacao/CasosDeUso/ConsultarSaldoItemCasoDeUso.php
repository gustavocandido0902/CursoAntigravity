<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Aplicacao\CasosDeUso;

use AlmoxarifadoPro\Aplicacao\DTOs\SaldoItemDTO;
use AlmoxarifadoPro\Dominio\Excecoes\ItemNaoEncontradoException;
use AlmoxarifadoPro\Dominio\Repositorios\ItemRepositorioInterface;

/**
 * Caso de uso responsável por consultar o saldo e parâmetros de um item.
 */
class ConsultarSaldoItemCasoDeUso
{
    public function __construct(
        private readonly ItemRepositorioInterface $itemRepositorio
    ) {
    }

    public function executar(string $codigo): SaldoItemDTO
    {
        $item = $this->itemRepositorio->buscarPorCodigo($codigo);
        if ($item === null) {
            throw new ItemNaoEncontradoException("Item '{$codigo}' não encontrado no almoxarifado.");
        }

        return new SaldoItemDTO(
            itemCodigo: $item->obterCodigo(),
            nome: $item->obterNome(),
            saldoAtual: $item->obterSaldoAtual(),
            estoqueMinimo: $item->obterEstoqueMinimo(),
            unidadeMedida: $item->obterUnidadeMedida(),
            abaixoMinimo: $item->isAbaixoOuNoEstoqueMinimo()
        );
    }
}
