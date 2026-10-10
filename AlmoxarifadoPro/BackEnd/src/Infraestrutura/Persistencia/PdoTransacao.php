<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Infraestrutura\Persistencia;

use AlmoxarifadoPro\Dominio\Repositorios\TransacaoInterface;
use PDO;

/**
 * Implementação de transação atômica gerenciada via driver PDO.
 */
class PdoTransacao implements TransacaoInterface
{
    public function __construct(
        private readonly PDO $pdo
    ) {
    }

    public function iniciar(): void
    {
        if (!$this->pdo->inTransaction()) {
            $this->pdo->beginTransaction();
        }
    }

    public function confirmar(): void
    {
        if ($this->pdo->inTransaction()) {
            $this->pdo->commit();
        }
    }

    public function reverter(): void
    {
        if ($this->pdo->inTransaction()) {
            $this->pdo->rollBack();
        }
    }
}
