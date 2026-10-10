<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Dominio\Excecoes;

use DomainException;

/**
 * Lançada quando a quantidade de retirada excede o saldo disponível.
 */
class EstoqueInsuficienteException extends DomainException
{
}
