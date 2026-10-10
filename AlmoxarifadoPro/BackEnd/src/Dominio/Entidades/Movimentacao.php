<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Dominio\Entidades;

use AlmoxarifadoPro\Dominio\Enums\TipoMovimentacao;
use AlmoxarifadoPro\Dominio\Enums\Turno;
use AlmoxarifadoPro\Dominio\Excecoes\RegraNegocioException;
use DateTimeImmutable;

/**
 * Entidade que registra o histórico imutável de movimentação no almoxarifado.
 */
class Movimentacao
{
    public function __construct(
        private readonly ?string $id,
        private readonly string $itemId,
        private readonly string $itemCodigo,
        private readonly TipoMovimentacao $tipo,
        private readonly float $quantidade,
        private readonly ?string $tecnicoMatricula,
        private readonly ?Turno $turno,
        private readonly DateTimeImmutable $dataHora
    ) {
        $this->validarRastreabilidade();
    }

    private function validarRastreabilidade(): void
    {
        if ($this->quantidade <= 0) {
            throw new RegraNegocioException('A quantidade movimentada deve ser maior que zero.');
        }
        if ($this->tipo === TipoMovimentacao::RETIRADA) {
            if ($this->tecnicoMatricula === null || trim($this->tecnicoMatricula) === '') {
                throw new RegraNegocioException('A matrícula do técnico é obrigatória para retiradas.');
            }
            if ($this->turno === null) {
                throw new RegraNegocioException('O turno de produção é obrigatório para retiradas.');
            }
        }
    }

    public function obterId(): ?string
    {
        return $this->id;
    }

    public function obterItemId(): string
    {
        return $this->itemId;
    }

    public function obterItemCodigo(): string
    {
        return $this->itemCodigo;
    }

    public function obterTipo(): TipoMovimentacao
    {
        return $this->tipo;
    }

    public function obterQuantidade(): float
    {
        return $this->quantidade;
    }

    public function obterTecnicoMatricula(): ?string
    {
        return $this->tecnicoMatricula;
    }

    public function obterTurno(): ?Turno
    {
        return $this->turno;
    }

    public function obterDataHora(): DateTimeImmutable
    {
        return $this->dataHora;
    }
}
