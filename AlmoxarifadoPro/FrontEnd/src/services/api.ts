/**
 * Assumption: The REST API operates on relative path or VITE_API_URL / REACT_APP_API_URL.
 * Fallback defaults to 'http://localhost:8000' during local terminal development.
 * Native window.fetch is used to avoid external dependencies like axios.
 */

import { ApiEnvelope, Item, WithdrawalPayload, WithdrawalResult } from '../types/inventory';

const envProcess = (globalThis as unknown as { process?: { env?: Record<string, string> } }).process;
const envMeta = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env;

const BASE_URL = envProcess?.env?.REACT_APP_API_URL || envMeta?.VITE_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  public status: number;
  public details?: string[];

  constructor(message: string, status: number, details?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function fetchItemBalance(itemCode: string): Promise<Item> {
  const sanitizedCode = encodeURIComponent(itemCode.trim());
  const response = await fetch(`${BASE_URL}/saldo?item_codigo=${sanitizedCode}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const payload: ApiEnvelope<{
    item_codigo: string;
    nome: string;
    saldo_atual: number;
    estoque_minimo: number;
    unidade_medida: string;
    abaixo_minimo: boolean;
  }> = await response.json();

  if (!response.ok || !payload.sucesso || !payload.dados) {
    throw new ApiError(payload.erro || 'Failed to fetch item balance.', response.status, payload.detalhes);
  }

  return {
    id: payload.dados.item_codigo,
    itemCodigo: payload.dados.item_codigo,
    nome: payload.dados.nome,
    saldoAtual: Number(payload.dados.saldo_atual),
    estoqueMinimo: Number(payload.dados.estoque_minimo),
    unidadeMedida: payload.dados.unidade_medida || 'UN',
    abaixoMinimo: Boolean(payload.dados.abaixo_minimo),
  };
}

export async function submitWithdrawal(data: WithdrawalPayload): Promise<WithdrawalResult> {
  const body = {
    item_codigo: data.itemCodigo.trim(),
    tipo: 'retirada',
    quantidade: data.quantidade,
    tecnico_matricula: data.tecnicoMatricula.trim(),
    turno: data.turno,
    data_hora: data.dataHora || new Date().toISOString(),
  };

  const response = await fetch(`${BASE_URL}/movimentacoes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload: ApiEnvelope<{
    item_codigo: string;
    tipo: 'retirada';
    quantidade: number;
    saldo_anterior: number;
    saldo_atual: number;
    alerta_estoque_minimo: boolean;
    data_hora: string;
  }> = await response.json();

  if (!response.ok || !payload.sucesso || !payload.dados) {
    throw new ApiError(payload.erro || 'Failed to submit withdrawal.', response.status, payload.detalhes);
  }

  return {
    itemCodigo: payload.dados.item_codigo,
    tipo: 'retirada',
    quantidade: Number(payload.dados.quantidade),
    saldoAnterior: Number(payload.dados.saldo_anterior),
    saldoAtual: Number(payload.dados.saldo_atual),
    alertaEstoqueMinimo: Boolean(payload.dados.alerta_estoque_minimo),
    dataHora: payload.dados.data_hora,
  };
}
