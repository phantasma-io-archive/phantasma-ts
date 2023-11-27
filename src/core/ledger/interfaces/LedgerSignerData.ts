import { Address } from '../../types';

export interface LedgerSignerData {
  success: boolean;
  message: string;
  publicKey?: string;
  address?: Address;
}
