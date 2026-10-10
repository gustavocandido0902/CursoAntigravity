<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Dominio\Enums;

/**
 * Enum nativo representando os turnos de trabalho na fábrica.
 */
enum Turno: string
{
    case A = 'A';
    case B = 'B';
    case C = 'C';
}
