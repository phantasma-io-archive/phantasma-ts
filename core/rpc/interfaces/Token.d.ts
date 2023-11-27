import { TokenExternal } from './TokenExternal';
import { TokenPrice } from './TokenPrice';
import { TokenSeries } from './TokenSeries';
export interface Token {
    symbol: string;
    name: string;
    decimals: number;
    currentSupply: string;
    maxSupply: string;
    burnedSupply: string;
    address: string;
    owner: string;
    flags: string;
    script: string;
    series: Array<TokenSeries>;
    external?: Array<TokenExternal>;
    price?: Array<TokenPrice>;
}
//# sourceMappingURL=Token.d.ts.map