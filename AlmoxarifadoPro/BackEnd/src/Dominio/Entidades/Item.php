<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Dominio\Entidades;

use AlmoxarifadoPro\Dominio\Excecoes\EstoqueInsuficienteException;
use AlmoxarifadoPro\Dominio\Excecoes\RegraNegocioException;

/**
 * Entidade de domínio que representa um item ou ferramenta do almoxarifado.
 */
class Item
{
    public function __construct(
        private readonly string $id,
        private readonly string $codigo,
        private readonly string $nome,
        private float $saldoAtual,
        private readonly float $estoqueMinimo,
        private readonly string $unidadeMedida = 'UN',
        private readonly bool $ativo = true
    ) {
    }

    public function obterId(): string
    {
        return $this->id;
    }

    public function obterCodigo(): string
    {
        return $this->codigo;
    }

    public function obterNome(): string
    {
        return $this->nome;
    }

    public function obterSaldoAtual(): float
    {
        return $this->saldoAtual;
    }

    public function obterEstoqueMinimo(): float
    {
        return $this->estoqueMinimo;
    }

    public function obterUnidadeMedida(): string
    {
        return $this->unidadeMedida;
    }

    public function isAtivo(): bool
    {
        return $this->ativo;
    }

    public function possuiSaldoSuficiente(float $quantidade): bool
    {
        return $this->saldoAtual >= $quantidade;
    }

    public function isAbaixoOuNoEstoqueMinimo(): bool
    {
        return $this->saldoAtual <= $this->estoqueMinimo;
    }

    public function debitarSaldo(float $quantidade): void
    {
        if ($quantidade <= 0) {
            throw new RegraNegocioException('Quantidade para débito deve ser superior a zero.');
        }
        if (!$this->possuiSaldoSuficiente($quantidade)) {
            throw new EstoqueInsuficienteException(
                "Saldo insuficiente para o item {$this->codigo}. Saldo atual: {$this->saldoAtual}."
            );
        }
        $this->saldoAtual -= $quantidade;
    }

    public function creditarSaldo(float $quantidade): void
    {
        if ($quantidade <= 0) {
            throw new RegraNegocioException('Quantidade para crédito deve ser superior a zero.');
        }
        $this->saldoAtual += $quantidade;
    }
}
