<?php

declare(strict_types=1);

// public/index.php

use AlmoxarifadoPro\Aplicacao\CasosDeUso\ConsultarHistoricoCasoDeUso;
use AlmoxarifadoPro\Aplicacao\CasosDeUso\ConsultarSaldoItemCasoDeUso;
use AlmoxarifadoPro\Aplicacao\CasosDeUso\ListarItensAbaixoMinimoCasoDeUso;
use AlmoxarifadoPro\Aplicacao\CasosDeUso\RegistrarReposicaoCasoDeUso;
use AlmoxarifadoPro\Aplicacao\CasosDeUso\RegistrarRetiradaCasoDeUso;
use AlmoxarifadoPro\Dominio\Excecoes\EstoqueInsuficienteException;
use AlmoxarifadoPro\Dominio\Excecoes\ItemNaoEncontradoException;
use AlmoxarifadoPro\Dominio\Excecoes\RegraNegocioException;
use AlmoxarifadoPro\Infraestrutura\Persistencia\FabricaConexao;
use AlmoxarifadoPro\Infraestrutura\Persistencia\PdoTransacao;
use AlmoxarifadoPro\Infraestrutura\Repositorios\PdoItemRepositorio;
use AlmoxarifadoPro\Infraestrutura\Repositorios\PdoMovimentacaoRepositorio;
use AlmoxarifadoPro\InterfaceUsuario\Controladores\EstoqueController;
use AlmoxarifadoPro\InterfaceUsuario\Controladores\MovimentacaoController;
use AlmoxarifadoPro\InterfaceUsuario\Http\Requisicao;
use AlmoxarifadoPro\InterfaceUsuario\Http\Resposta;
use AlmoxarifadoPro\InterfaceUsuario\Validadores\MovimentacaoValidador;
use AlmoxarifadoPro\InterfaceUsuario\Validadores\ValidacaoException;

/**
 * Carrega variáveis de ambiente a partir de arquivo .env se presente.
 */
function carregarVariaveisAmbiente(): void
{
    $envFile = __DIR__ . '/../.env';
    if (!file_exists($envFile)) {
        return;
    }
    $linhas = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    foreach ($linhas as $linha) {
        $linha = trim($linha);
        if ($linha === '' || str_starts_with($linha, '#') || !str_contains($linha, '=')) {
            continue;
        }
        [$chave, $valor] = explode('=', $linha, 2);
        $chave = trim($chave);
        $valor = trim($valor);
        putenv("{$chave}={$valor}");
        $_ENV[$chave] = $valor;
    }
}

/**
 * Registra o autoloading compatível com PSR-4 e fallback nativo.
 */
function registrarAutoloader(): void
{
    $composerAutoload = __DIR__ . '/../vendor/autoload.php';
    if (file_exists($composerAutoload)) {
        require_once $composerAutoload;
        return;
    }
    spl_autoload_register(function (string $classe): void {
        $prefixo = 'AlmoxarifadoPro\\';
        if (str_starts_with($classe, $prefixo)) {
            $relativo = substr($classe, strlen($prefixo));
            $arquivo = __DIR__ . '/../src/' . str_replace('\\', '/', $relativo) . '.php';
            if (file_exists($arquivo)) {
                require_once $arquivo;
            }
        }
    });
}

/**
 * Inicializa a injeção de dependências dos controladores da aplicação.
 *
 * @return array{movimentacao: MovimentacaoController, estoque: EstoqueController}
 */
function criarControladores(): array
{
    $pdo = FabricaConexao::criar();
    $transacao = new PdoTransacao($pdo);
    $itemRepo = new PdoItemRepositorio($pdo);
    $movRepo = new PdoMovimentacaoRepositorio($pdo);

    $retirada = new RegistrarRetiradaCasoDeUso($itemRepo, $movRepo, $transacao);
    $reposicao = new RegistrarReposicaoCasoDeUso($itemRepo, $movRepo, $transacao);
    $saldo = new ConsultarSaldoItemCasoDeUso($itemRepo);
    $minimo = new ListarItensAbaixoMinimoCasoDeUso($itemRepo);
    $historico = new ConsultarHistoricoCasoDeUso($movRepo);
    $validador = new MovimentacaoValidador();

    return [
        'movimentacao' => new MovimentacaoController($retirada, $reposicao, $historico, $validador),
        'estoque' => new EstoqueController($saldo, $minimo),
    ];
}

/**
 * Roteia a requisição HTTP para a ação correspondente no controlador.
 *
 * @param array{movimentacao: MovimentacaoController, estoque: EstoqueController} $ctrls
 */
function despacharRota(Requisicao $req, array $ctrls): Resposta
{
    $metodo = $req->obterMetodo();
    $caminho = $req->obterCaminho();

    return match (true) {
        $metodo === 'POST' && in_array($caminho, ['/movimentacoes', '/movimentacoes/retirada', '/movimentacoes/reposicao'])
            => $ctrls['movimentacao']->registrar($req),
        $metodo === 'GET' && $caminho === '/historico'
            => $ctrls['movimentacao']->historico($req),
        $metodo === 'GET' && in_array($caminho, ['/saldo', '/itens/saldo'])
            => $ctrls['estoque']->consultarSaldo($req),
        $metodo === 'GET' && in_array($caminho, ['/estoque-minimo', '/itens/estoque-minimo'])
            => $ctrls['estoque']->listarEstoqueMinimo($req),
        default => Resposta::erro('Rota não encontrada.', 404),
    };
}

/**
 * Trata exceções da aplicação convertendo-as em respostas HTTP estritas.
 */
function tratarExcecao(Throwable $e): Resposta
{
    return match (true) {
        $e instanceof ValidacaoException
            => Resposta::erro($e->getMessage(), 422, $e->obterErros()),
        $e instanceof ItemNaoEncontradoException
            => Resposta::erro($e->getMessage(), 404),
        $e instanceof EstoqueInsuficienteException
            => Resposta::erro($e->getMessage(), 409),
        $e instanceof RegraNegocioException || $e instanceof InvalidArgumentException
            => Resposta::erro($e->getMessage(), 400),
        default => Resposta::erro('Erro interno no servidor ao processar requisição.', 500),
    };
}

// Execução do pipeline HTTP
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');
    http_response_code(204);
    exit(0);
}

carregarVariaveisAmbiente();
registrarAutoloader();
$requisicao = Requisicao::capturar();

try {
    $controladores = criarControladores();
    $resposta = despacharRota($requisicao, $controladores);
} catch (Throwable $e) {
    $resposta = tratarExcecao($e);
}

$resposta->enviar();
