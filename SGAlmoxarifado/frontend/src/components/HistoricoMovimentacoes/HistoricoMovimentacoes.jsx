import React from 'react';
import './HistoricoMovimentacoes.css';

// Formata data ISO para o padrão brasileiro de exibição
function formatarData(dataIso) {
  if (!dataIso) return '-';
  const data = new Date(dataIso);
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Localiza o nome do produto correspondente ao ID
function resolverNomeProduto(produtos, id) {
  const produto = produtos.find((p) => String(p.id) === String(id));
  return produto ? produto.nome : `Produto #${id}`;
}

// Localiza o nome do usuário/operador correspondente ao ID
function resolverNomeUsuario(usuarios, id) {
  const usuario = usuarios.find((u) => String(u.id) === String(id));
  return usuario ? usuario.nome : `Usuário #${id}`;
}

export function HistoricoMovimentacoes({ movimentacoes, produtos, usuarios, carregando }) {
  const ultimasMovimentacoes = [...movimentacoes].reverse().slice(0, 10);

  return (
    <div className="card-historico">
      <div className="card-header">
        <h2 className="card-titulo">Últimas Movimentações</h2>
        <p className="card-subtitulo">Histórico recente de entradas e saídas registradas</p>
      </div>

      {carregando ? (
        <div className="estado-vazio">Carregando histórico...</div>
      ) : ultimasMovimentacoes.length === 0 ? (
        <div className="estado-vazio">Nenhuma movimentação registrada ainda.</div>
      ) : (
        <div className="tabela-container">
          <table className="tabela-historico">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Tipo</th>
                <th>Produto</th>
                <th className="texto-centro">Qtd</th>
                <th>Operador</th>
              </tr>
            </thead>
            <tbody>
              {ultimasMovimentacoes.map((item) => (
                <tr key={item.id}>
                  <td className="col-data">{formatarData(item.data)}</td>
                  <td>
                    <span className={`badge-tipo ${item.tipo}`}>
                      {item.tipo === 'entrada' ? '▲ Entrada' : '▼ Saída'}
                    </span>
                  </td>
                  <td className="col-produto">{resolverNomeProduto(produtos, item.produto_id)}</td>
                  <td className="col-qtd texto-centro">{item.quantidade_movimentada}</td>
                  <td className="col-usuario">{resolverNomeUsuario(usuarios, item.usuario_id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
