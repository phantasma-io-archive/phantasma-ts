import { Address } from '../../types';

export interface LedgerSigner {
  GetPublicKey: () => string;
  GetAccount: () => Address;
}
