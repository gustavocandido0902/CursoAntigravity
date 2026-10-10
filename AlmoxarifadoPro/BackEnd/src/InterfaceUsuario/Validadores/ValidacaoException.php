<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\InterfaceUsuario\Validadores;

use InvalidArgumentException;

/**
 * Exceção lançada quando a validação de entrada de dados da requisição falha.
 */
class ValidacaoException extends InvalidArgumentException
{
    /**
     * @param string[] $erros
     */
    public function __construct(
        private readonly array $erros
    ) {
        parent::__construct('Falha na validação dos dados de entrada.');
    }

    /**
     * @return string[]
     */
    public function obterErros(): array
    {
        return $this->erros;
    }
}
