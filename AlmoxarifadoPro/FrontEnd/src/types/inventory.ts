/**
 * Assumption: Field names follow standard camelCase in the frontend domain,
 * with serialization to snake_case handled seamlessly at the API client boundary
 * to conform with the backend AlmoxarifadoPro REST contract.
 */

export type ProductionShift = 'A' | 'B' | 'C';

export interface Item {
  id: string;
  itemCodigo: string;
  nome: string;
  saldoAtual: number;
  estoqueMinimo: number;
  unidadeMedida: string;
  abaixoMinimo: boolean;
}

export interface WithdrawalPayload {
  itemCodigo: string;
  tipo: 'retirada';
  quantidade: number;
  tecnicoMatricula: string;
  turno: ProductionShift;
  dataHora?: string;
}

export interface WithdrawalResult {
  itemCodigo: string;
  tipo: 'retirada';
  quantidade: number;
  saldoAnterior: number;
  saldoAtual: number;
  alertaEstoqueMinimo: boolean;
  dataHora: string;
}

export interface ApiEnvelope<T> {
  sucesso: boolean;
  dados?: T;
  erro?: string;
  detalhes?: string[];
}
