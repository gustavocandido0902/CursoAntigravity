<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Aplicacao\DTOs;

use AlmoxarifadoPro\Dominio\Enums\TipoMovimentacao;
use AlmoxarifadoPro\Dominio\Enums\Turno;
use DateTimeImmutable;

/**
 * Objeto de transferência de dados para registro de movimentação de material.
 */
class RegistrarMovimentacaoDTO
{
    public function __construct(
        public readonly string $itemCodigo,
        public readonly TipoMovimentacao $tipo,
        public readonly float $quantidade,
        public readonly ?string $tecnicoMatricula = null,
        public readonly ?Turno $turno = null,
        public readonly ?DateTimeImmutable $dataHora = null
    ) {
    }
}
