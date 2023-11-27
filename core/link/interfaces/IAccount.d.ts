import { Balance } from '../../rpc/interfaces/Balance';
import { IFile } from './IFile';
export interface IAccount {
    alias: string;
    name: string;
    address: string;
    avatar: string;
    platform: string;
    external: string;
    balances: Balance[];
    files: IFile[];
}
//# sourceMappingURL=IAccount.d.ts.map