<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Dominio\Repositorios;

use AlmoxarifadoPro\Dominio\Entidades\Movimentacao;
use AlmoxarifadoPro\Dominio\Enums\Turno;

/**
 * Contrato de persistência para movimentações e histórico de retiradas/reposições.
 */
interface MovimentacaoRepositorioInterface
{
    public function inserir(Movimentacao $movimentacao): void;

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listarPorTecnicoOuTurno(?string $matricula, ?Turno $turno): array;
}
