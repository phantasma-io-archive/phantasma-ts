import { TokenSeriesMode } from '../../interfaces';
import { ABIMethod } from './ABIMethod';
export interface TokenSeries {
    seriesID: number;
    currentSupply: string;
    maxSupply: string;
    burnedSupply: string;
    mode: TokenSeriesMode;
    script: string;
    methods: Array<ABIMethod>;
}
//# sourceMappingURL=TokenSeries.d.ts.map