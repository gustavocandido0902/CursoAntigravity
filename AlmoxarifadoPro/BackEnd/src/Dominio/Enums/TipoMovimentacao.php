<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Dominio\Enums;

/**
 * Enum nativo representando os tipos possíveis de movimentação de estoque.
 */
enum TipoMovimentacao: string
{
    case RETIRADA = 'retirada';
    case REPOSICAO = 'reposicao';
}
