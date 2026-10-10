<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\InterfaceUsuario\Controladores;

use AlmoxarifadoPro\Aplicacao\CasosDeUso\ConsultarHistoricoCasoDeUso;
use AlmoxarifadoPro\Aplicacao\CasosDeUso\RegistrarReposicaoCasoDeUso;
use AlmoxarifadoPro\Aplicacao\CasosDeUso\RegistrarRetiradaCasoDeUso;
use AlmoxarifadoPro\Dominio\Enums\TipoMovimentacao;
use AlmoxarifadoPro\Dominio\Enums\Turno;
use AlmoxarifadoPro\InterfaceUsuario\Http\Requisicao;
use AlmoxarifadoPro\InterfaceUsuario\Http\Resposta;
use AlmoxarifadoPro\InterfaceUsuario\Validadores\MovimentacaoValidador;
use AlmoxarifadoPro\InterfaceUsuario\Validadores\ValidacaoException;

/**
 * Controlador HTTP para processar requisições de movimentação e histórico.
 */
class MovimentacaoController
{
    public function __construct(
        private readonly RegistrarRetiradaCasoDeUso $retiradaCasoDeUso,
        private readonly RegistrarReposicaoCasoDeUso $reposicaoCasoDeUso,
        private readonly ConsultarHistoricoCasoDeUso $historicoCasoDeUso,
        private readonly MovimentacaoValidador $validador
    ) {
    }

    public function registrar(Requisicao $requisicao): Resposta
    {
        $dto = $this->validador->validar($requisicao->obterCorpo());
        $resultado = ($dto->tipo === TipoMovimentacao::RETIRADA)
            ? $this->retiradaCasoDeUso->executar($dto)
            : $this->reposicaoCasoDeUso->executar($dto);

        return Resposta::sucesso($resultado->toArray(), 201);
    }

    public function historico(Requisicao $requisicao): Resposta
    {
        $matricula = $requisicao->obterParametro('tecnico');
        $matriculaStr = $matricula !== null ? trim((string) $matricula) : null;
        $turnoStr = $requisicao->obterParametro('turno');
        $turno = $turnoStr !== null ? Turno::tryFrom((string) $turnoStr) : null;

        if ($turnoStr !== null && $turno === null) {
            throw new ValidacaoException(["O turno informado deve ser 'A', 'B' ou 'C'."]);
        }

        $historico = $this->historicoCasoDeUso->executar($matriculaStr ?: null, $turno);
        return Resposta::sucesso($historico, 200);
    }
}
