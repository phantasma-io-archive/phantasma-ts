import { Platform } from './Platform';
import { Governance } from './Governance';
import { Token } from './Token';
import { Chain } from './Chain';
export interface Nexus {
    name: string;
    protocol: string;
    platforms: Array<Platform>;
    tokens: Array<Token>;
    chains: Array<Chain>;
    governance: Array<Governance>;
    organizations: Array<string>;
}
//# sourceMappingURL=Nexus.d.ts.map