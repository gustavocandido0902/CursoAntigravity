<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Aplicacao\CasosDeUso;

use AlmoxarifadoPro\Dominio\Enums\Turno;
use AlmoxarifadoPro\Dominio\Repositorios\MovimentacaoRepositorioInterface;

/**
 * Caso de uso responsável por consultar o histórico de movimentações filtrando por técnico ou turno.
 */
class ConsultarHistoricoCasoDeUso
{
    public function __construct(
        private readonly MovimentacaoRepositorioInterface $movimentacaoRepositorio
    ) {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function executar(?string $matricula, ?Turno $turno): array
    {
        return $this->movimentacaoRepositorio->listarPorTecnicoOuTurno($matricula, $turno);
    }
}
