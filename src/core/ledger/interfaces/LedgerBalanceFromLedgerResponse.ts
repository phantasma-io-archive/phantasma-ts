import { Address } from '../../types';

export interface LedgerBalanceFromLedgerResponse {
  success: boolean;
  message: string;
  publicKey?: string;
  address?: Address;
}
