<?php

declare(strict_types=1);

namespace AlmoxarifadoPro\Infraestrutura\Persistencia;

use PDO;

/**
 * Fábrica de conexão segura com o banco PostgreSQL via PDO utilizando variáveis de ambiente.
 */
class FabricaConexao
{
    public static function criar(): PDO
    {
        $host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? '127.0.0.1');
        $port = getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? '5432');
        $banco = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'almoxarifado_db');
        $usuario = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'postgres');
        $senha = getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? '');

        $dsn = "pgsql:host={$host};port={$port};dbname={$banco};";

        return new PDO($dsn, $usuario, $senha, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
}
