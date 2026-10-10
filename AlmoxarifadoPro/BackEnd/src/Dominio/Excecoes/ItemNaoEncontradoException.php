<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Dominio\Excecoes;

use DomainException;

/**
 * Lançada quando um item solicitado não existe ou está inativo.
 */
class ItemNaoEncontradoException extends DomainException
{
}
