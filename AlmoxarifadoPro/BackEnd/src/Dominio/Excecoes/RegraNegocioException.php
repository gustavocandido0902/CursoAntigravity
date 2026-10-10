<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Dominio\Excecoes;

use DomainException;

/**
 * Lançada quando parâmetros ou estados violam regras de negócio do almoxarifado.
 */
class RegraNegocioException extends DomainException
{
}
