<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\InterfaceUsuario\Controladores;

use AlmoxarifadoPro\Aplicacao\CasosDeUso\ConsultarSaldoItemCasoDeUso;
use AlmoxarifadoPro\Aplicacao\CasosDeUso\ListarItensAbaixoMinimoCasoDeUso;
use AlmoxarifadoPro\Aplicacao\DTOs\SaldoItemDTO;
use AlmoxarifadoPro\InterfaceUsuario\Http\Requisicao;
use AlmoxarifadoPro\InterfaceUsuario\Http\Resposta;
use AlmoxarifadoPro\InterfaceUsuario\Validadores\ValidacaoException;

/**
 * Controlador HTTP para consultas de saldo e monitoramento de estoque mínimo.
 */
class EstoqueController
{
    public function __construct(
        private readonly ConsultarSaldoItemCasoDeUso $saldoCasoDeUso,
        private readonly ListarItensAbaixoMinimoCasoDeUso $minimoCasoDeUso
    ) {
    }

    public function consultarSaldo(Requisicao $requisicao): Resposta
    {
        $codigo = $requisicao->obterParametro('item_codigo')
            ?: $requisicao->obterParametro('codigo');

        if ($codigo === null || trim((string) $codigo) === '') {
            throw new ValidacaoException(["O parâmetro 'item_codigo' é obrigatório para consulta."]);
        }

        $saldo = $this->saldoCasoDeUso->executar(trim((string) $codigo));
        return Resposta::sucesso($saldo->toArray(), 200);
    }

    public function listarEstoqueMinimo(Requisicao $requisicao): Resposta
    {
        $itens = $this->minimoCasoDeUso->executar();
        $dados = array_map(fn (SaldoItemDTO $dto): array => $dto->toArray(), $itens);

        return Resposta::sucesso($dados, 200);
    }
}
