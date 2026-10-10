<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Dominio\Repositorios;

/**
 * Contrato abstrato para gerenciamento atômico de transações de banco de dados.
 */
interface TransacaoInterface
{
    public function iniciar(): void;

    public function confirmar(): void;

    public function reverter(): void;
}
