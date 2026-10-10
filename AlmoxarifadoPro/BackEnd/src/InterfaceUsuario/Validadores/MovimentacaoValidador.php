<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\InterfaceUsuario\Validadores;

use AlmoxarifadoPro\Aplicacao\DTOs\RegistrarMovimentacaoDTO;
use AlmoxarifadoPro\Dominio\Enums\TipoMovimentacao;
use AlmoxarifadoPro\Dominio\Enums\Turno;
use DateTimeImmutable;

/**
 * Validador das cargas úteis (payloads) de entrada para operações de movimentação.
 */
class MovimentacaoValidador
{
    /**
     * @param array<string, mixed> $dados
     */
    public function validar(array $dados): RegistrarMovimentacaoDTO
    {
        $erros = [];
        $codigo = $this->validarCodigo($dados, $erros);
        $tipo = $this->validarTipo($dados, $erros);
        $quantidade = $this->validarQuantidade($dados, $erros);
        $matricula = $this->validarMatricula($dados, $tipo, $erros);
        $turno = $this->validarTurno($dados, $tipo, $erros);
        $dataHora = $this->validarDataHora($dados, $erros);

        if (!empty($erros)) {
            throw new ValidacaoException($erros);
        }

        return new RegistrarMovimentacaoDTO($codigo, $tipo, $quantidade, $matricula, $turno, $dataHora);
    }

    /**
     * @param array<string, mixed> $dados
     * @param string[] $erros
     */
    private function validarCodigo(array $dados, array &$erros): string
    {
        $codigo = trim((string) ($dados['item_codigo'] ?? ''));
        if ($codigo === '') {
            $erros[] = "O campo 'item_codigo' é obrigatório.";
        }
        return $codigo;
    }

    /**
     * @param array<string, mixed> $dados
     * @param string[] $erros
     */
    private function validarTipo(array $dados, array &$erros): TipoMovimentacao
    {
        $tipoStr = (string) ($dados['tipo'] ?? '');
        $tipo = TipoMovimentacao::tryFrom($tipoStr);
        if ($tipo === null) {
            $erros[] = "O campo 'tipo' deve ser 'retirada' ou 'reposicao'.";
            return TipoMovimentacao::RETIRADA;
        }
        return $tipo;
    }

    /**
     * @param array<string, mixed> $dados
     * @param string[] $erros
     */
    private function validarQuantidade(array $dados, array &$erros): float
    {
        if (!isset($dados['quantidade']) || !is_numeric($dados['quantidade'])) {
            $erros[] = "O campo 'quantidade' deve ser numérico.";
            return 0.0;
        }
        $quantidade = (float) $dados['quantidade'];
        if ($quantidade <= 0) {
            $erros[] = "O campo 'quantidade' deve ser maior que zero.";
        }
        return $quantidade;
    }

    /**
     * @param array<string, mixed> $dados
     * @param string[] $erros
     */
    private function validarMatricula(array $dados, TipoMovimentacao $tipo, array &$erros): ?string
    {
        $matricula = isset($dados['tecnico_matricula']) ? trim((string) $dados['tecnico_matricula']) : null;
        if ($tipo === TipoMovimentacao::RETIRADA && ($matricula === null || $matricula === '')) {
            $erros[] = "O campo 'tecnico_matricula' é obrigatório para retiradas.";
        }
        return $matricula ?: null;
    }

    /**
     * @param array<string, mixed> $dados
     * @param string[] $erros
     */
    private function validarTurno(array $dados, TipoMovimentacao $tipo, array &$erros): ?Turno
    {
        $turnoStr = isset($dados['turno']) ? trim((string) $dados['turno']) : null;
        if ($tipo === TipoMovimentacao::RETIRADA) {
            $turno = Turno::tryFrom((string) $turnoStr);
            if ($turno === null) {
                $erros[] = "O campo 'turno' é obrigatório para retiradas e deve ser 'A', 'B' ou 'C'.";
            }
            return $turno;
        }
        return $turnoStr ? Turno::tryFrom($turnoStr) : null;
    }

    /**
     * @param array<string, mixed> $dados
     * @param string[] $erros
     */
    private function validarDataHora(array $dados, array &$erros): ?DateTimeImmutable
    {
        if (empty($dados['data_hora'])) {
            return new DateTimeImmutable();
        }
        $data = DateTimeImmutable::createFromFormat(DateTimeImmutable::ATOM, (string) $dados['data_hora']);
        if ($data === false) {
            $erros[] = "O campo 'data_hora' deve estar no formato ISO 8601 (ex: 2026-03-14T08:15:00-03:00).";
            return null;
        }
        return $data;
    }
}
