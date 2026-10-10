<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\InterfaceUsuario\Http;

/**
 * Abstração de resposta HTTP formatada em JSON.
 */
class Resposta
{
    /**
     * @param array<string, mixed> $dados
     */
    public function __construct(
        private readonly int $status,
        private readonly array $dados
    ) {
    }

    /**
     * @param array<string, mixed> $dados
     */
    public static function sucesso(array $dados, int $status = 200): self
    {
        return new self($status, [
            'sucesso' => true,
            'dados' => $dados,
        ]);
    }

    /**
     * @param array<string, mixed> $detalhes
     */
    public static function erro(string $mensagem, int $status, array $detalhes = []): self
    {
        $payload = [
            'sucesso' => false,
            'erro' => $mensagem,
        ];
        if (!empty($detalhes)) {
            $payload['detalhes'] = $detalhes;
        }

        return new self($status, $payload);
    }

    public function enviar(): void
    {
        http_response_code($this->status);
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($this->dados, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
}
