<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Infraestrutura\Repositorios;

use AlmoxarifadoPro\Dominio\Entidades\Movimentacao;
use AlmoxarifadoPro\Dominio\Enums\Turno;
use AlmoxarifadoPro\Dominio\Repositorios\MovimentacaoRepositorioInterface;
use DateTimeImmutable;
use PDO;

/**
 * Repositório PDO para persistência de movimentações na tabela stock_movements do schema.sql.
 */
class PdoMovimentacaoRepositorio implements MovimentacaoRepositorioInterface
{
    public function __construct(
        private readonly PDO $pdo
    ) {
    }

    public function inserir(Movimentacao $movimentacao): void
    {
        $sql = 'INSERT INTO stock_movements (
                    product_id, movement_type, quantity, tecnico_matricula, turno, created_at
                ) VALUES (
                    :product_id, :movement_type, :quantity, :tecnico_matricula, :turno, :created_at
                )';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'product_id' => $movimentacao->obterItemId(),
            'movement_type' => $movimentacao->obterTipo()->value,
            'quantity' => $movimentacao->obterQuantidade(),
            'tecnico_matricula' => $movimentacao->obterTecnicoMatricula(),
            'turno' => $movimentacao->obterTurno()?->value,
            'created_at' => $movimentacao->obterDataHora()->format(DateTimeImmutable::ATOM),
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listarPorTecnicoOuTurno(?string $matricula, ?Turno $turno): array
    {
        $sql = 'SELECT m.id, p.sku AS item_codigo, p.name AS item_nome, m.movement_type AS tipo, 
                       m.quantity AS quantidade, m.tecnico_matricula, m.turno, m.created_at AS data_hora 
                FROM stock_movements m 
                INNER JOIN products p ON p.id = m.product_id 
                WHERE 1=1';
        $params = [];
        if ($matricula !== null && $matricula !== '') {
            $sql .= ' AND m.tecnico_matricula = :matricula';
            $params['matricula'] = $matricula;
        }
        if ($turno !== null) {
            $sql .= ' AND m.turno = :turno';
            $params['turno'] = $turno->value;
        }
        $sql .= ' ORDER BY m.created_at DESC LIMIT 100';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $registros = $stmt->fetchAll();

        return array_map(fn (array $linha): array => $this->formatarRegistro($linha), $registros);
    }

    /**
     * @param array<string, mixed> $linha
     * @return array<string, mixed>
     */
    private function formatarRegistro(array $linha): array
    {
        return [
            'id' => (string) $linha['id'],
            'item_codigo' => (string) $linha['item_codigo'],
            'item_nome' => (string) $linha['item_nome'],
            'tipo' => (string) $linha['tipo'],
            'quantidade' => (float) $linha['quantidade'],
            'tecnico_matricula' => $linha['tecnico_matricula'] ? (string) $linha['tecnico_matricula'] : null,
            'turno' => $linha['turno'] ? (string) $linha['turno'] : null,
            'data_hora' => (string) $linha['data_hora'],
        ];
    }
}
