import { Address } from '../../types';
export interface LedgerBalanceFromLedgerResponse {
    success: boolean;
    message: string;
    publicKey?: string;
    address?: Address;
    balances?: Map<string, {
        amount: number;
        decimals: number;
    }>;
}
//# sourceMappingURL=LedgerBalanceFromLedgerResponse.d.ts.map