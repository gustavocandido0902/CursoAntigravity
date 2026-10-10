<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Aplicacao\DTOs;

/**
 * Objeto de transferência de dados com informações de saldo de um item.
 */
class SaldoItemDTO
{
    public function __construct(
        public readonly string $itemCodigo,
        public readonly string $nome,
        public readonly float $saldoAtual,
        public readonly float $estoqueMinimo,
        public readonly string $unidadeMedida,
        public readonly bool $abaixoMinimo
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'item_codigo' => $this->itemCodigo,
            'nome' => $this->nome,
            'saldo_atual' => $this->saldoAtual,
            'estoque_minimo' => $this->estoqueMinimo,
            'unidade_medida' => $this->unidadeMedida,
            'abaixo_minimo' => $this->abaixoMinimo,
        ];
    }
}
