import { TransactionData } from './TransactionData';

export interface AccountTransactions {
  address: string;
  txs: Array<TransactionData>; //List of transactions
}
