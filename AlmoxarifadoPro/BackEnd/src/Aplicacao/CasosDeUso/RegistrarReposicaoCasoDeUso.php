<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Aplicacao\CasosDeUso;

use AlmoxarifadoPro\Aplicacao\DTOs\RegistrarMovimentacaoDTO;
use AlmoxarifadoPro\Aplicacao\DTOs\ResultadoMovimentacaoDTO;
use AlmoxarifadoPro\Dominio\Entidades\Item;
use AlmoxarifadoPro\Dominio\Entidades\Movimentacao;
use AlmoxarifadoPro\Dominio\Enums\TipoMovimentacao;
use AlmoxarifadoPro\Dominio\Excecoes\ItemNaoEncontradoException;
use AlmoxarifadoPro\Dominio\Repositorios\ItemRepositorioInterface;
use AlmoxarifadoPro\Dominio\Repositorios\MovimentacaoRepositorioInterface;
use AlmoxarifadoPro\Dominio\Repositorios\TransacaoInterface;
use DateTimeImmutable;
use Throwable;

/**
 * Caso de uso responsável por registrar a reposição de estoque de materiais.
 */
class RegistrarReposicaoCasoDeUso
{
    public function __construct(
        private readonly ItemRepositorioInterface $itemRepositorio,
        private readonly MovimentacaoRepositorioInterface $movimentacaoRepositorio,
        private readonly TransacaoInterface $transacao
    ) {
    }

    public function executar(RegistrarMovimentacaoDTO $dto): ResultadoMovimentacaoDTO
    {
        $item = $this->obterItemValido($dto->itemCodigo);
        $saldoAnterior = $item->obterSaldoAtual();
        $item->creditarSaldo($dto->quantidade);
        $movimentacao = $this->criarMovimentacao($item, $dto);
        $this->persistirTransacao($item, $movimentacao);

        return new ResultadoMovimentacaoDTO(
            itemCodigo: $item->obterCodigo(),
            tipo: TipoMovimentacao::REPOSICAO,
            quantidade: $dto->quantidade,
            saldoAnterior: $saldoAnterior,
            saldoAtual: $item->obterSaldoAtual(),
            alertaEstoqueMinimo: $item->isAbaixoOuNoEstoqueMinimo(),
            dataHora: $movimentacao->obterDataHora()
        );
    }

    private function obterItemValido(string $codigo): Item
    {
        $item = $this->itemRepositorio->buscarPorCodigo($codigo);
        if ($item === null) {
            throw new ItemNaoEncontradoException("Item '{$codigo}' não encontrado no almoxarifado.");
        }
        return $item;
    }

    private function criarMovimentacao(Item $item, RegistrarMovimentacaoDTO $dto): Movimentacao
    {
        return new Movimentacao(
            id: null,
            itemId: $item->obterId(),
            itemCodigo: $item->obterCodigo(),
            tipo: TipoMovimentacao::REPOSICAO,
            quantidade: $dto->quantidade,
            tecnicoMatricula: $dto->tecnicoMatricula,
            turno: $dto->turno,
            dataHora: $dto->dataHora ?? new DateTimeImmutable()
        );
    }

    private function persistirTransacao(Item $item, Movimentacao $movimentacao): void
    {
        $this->transacao->iniciar();
        try {
            $this->itemRepositorio->atualizarSaldo($item->obterId(), $item->obterSaldoAtual());
            $this->movimentacaoRepositorio->inserir($movimentacao);
            $this->transacao->confirmar();
        } catch (Throwable $e) {
            $this->transacao->reverter();
            throw $e;
        }
    }
}
