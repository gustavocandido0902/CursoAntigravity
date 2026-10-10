<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\InterfaceUsuario\Http;

/**
 * Abstração simplificada de uma requisição HTTP.
 */
class Requisicao
{
    /**
     * @param array<string, mixed> $corpo
     * @param array<string, mixed> $parametrosUrl
     */
    public function __construct(
        private readonly string $metodo,
        private readonly string $caminho,
        private readonly array $corpo,
        private readonly array $parametrosUrl
    ) {
    }

    public static function capturar(): self
    {
        $metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $caminho = parse_url($uri, PHP_URL_PATH) ?: '/';
        $conteudoBruto = file_get_contents('php://input') ?: '';
        $corpo = json_decode($conteudoBruto, true) ?: [];

        return new self($metodo, $caminho, $corpo, $_GET);
    }

    public function obterMetodo(): string
    {
        return strtoupper($this->metodo);
    }

    public function obterCaminho(): string
    {
        return rtrim($this->caminho, '/') ?: '/';
    }

    /**
     * @return array<string, mixed>
     */
    public function obterCorpo(): array
    {
        return $this->corpo;
    }

    public function obterParametro(string $chave, mixed $padrao = null): mixed
    {
        return $this->parametrosUrl[$chave] ?? $padrao;
    }
}
