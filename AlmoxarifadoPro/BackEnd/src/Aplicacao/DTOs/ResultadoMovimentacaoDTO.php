<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Aplicacao\DTOs;

use AlmoxarifadoPro\Dominio\Enums\TipoMovimentacao;
use DateTimeImmutable;

/**
 * Objeto de transferência com o resultado e alerta de movimentação processada.
 */
class ResultadoMovimentacaoDTO
{
    public function __construct(
        public readonly string $itemCodigo,
        public readonly TipoMovimentacao $tipo,
        public readonly float $quantidade,
        public readonly float $saldoAnterior,
        public readonly float $saldoAtual,
        public readonly bool $alertaEstoqueMinimo,
        public readonly DateTimeImmutable $dataHora
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'item_codigo' => $this->itemCodigo,
            'tipo' => $this->tipo->value,
            'quantidade' => $this->quantidade,
            'saldo_anterior' => $this->saldoAnterior,
            'saldo_atual' => $this->saldoAtual,
            'alerta_estoque_minimo' => $this->alertaEstoqueMinimo,
            'data_hora' => $this->dataHora->format(DateTimeImmutable::ATOM),
        ];
    }
}
