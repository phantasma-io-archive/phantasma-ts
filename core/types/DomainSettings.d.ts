import { Address } from './Address';
import { Timestamp } from './Timestamp';
export declare enum TriggerResult {
    Failure = 0,
    Missing = 1,
    Success = 2
}
export declare enum AccountTrigger {
    OnMint = 0,
    OnBurn = 1,
    OnSend = 2,
    OnReceive = 3,
    OnWitness = 4,
    OnUpgrade = 5,
    OnMigrate = 6,
    OnKill = 7
}
export declare enum TokenTrigger {
    OnMint = 0,
    OnBurn = 1,
    OnSend = 2,
    OnReceive = 3,
    OnInfuse = 4,
    OnUpgrade = 5,
    OnSeries = 6,
    OnWrite = 7,
    OnMigrate = 8,
    OnKill = 9
}
export declare enum OrganizationTrigger {
    OnAdd = 0,
    OnRemove = 1,
    OnUpgrade = 2
}
export declare class StakeReward {
    staker: Address;
    date: Timestamp;
    constructor(staker: Address, date: Timestamp);
}
export declare class DomainSettings {
    static LatestKnownProtocol: number;
    static Phantasma20Protocol: number;
    static Phantasma30Protocol: number;
    static MaxTxPerBlock: number;
    static MaxOracleEntriesPerBlock: number;
    static MaxEventsPerBlock: number;
    static MaxEventsPerTx: number;
    static MaxTriggerLoop: number;
    static MAX_TOKEN_DECIMALS: number;
    static DefaultMinimumGasFee: number;
    static InitialValidatorCount: number;
    static FuelTokenSymbol: string;
    static FuelTokenName: string;
    static FuelTokenDecimals: number;
    static NexusMainnet: string;
    static NexusTestnet: string;
    static StakingTokenSymbol: string;
    static StakingTokenName: string;
    static StakingTokenDecimals: number;
    static FiatTokenSymbol: string;
    static FiatTokenName: string;
    static FiatTokenDecimals: number;
    static RewardTokenSymbol: string;
    static RewardTokenName: string;
    static LiquidityTokenSymbol: string;
    static LiquidityTokenName: string;
    static LiquidityTokenDecimals: number;
    static FuelPerContractDeployTag: string;
    static FuelPerTokenDeployTag: string;
    static FuelPerOrganizationDeployTag: string;
    static SystemTokens: string[];
    static RootChainName: string;
    static ValidatorsOrganizationName: string;
    static MastersOrganizationName: string;
    static StakersOrganizationName: string;
    static PhantomForceOrganizationName: string;
    static PlatformName: string;
    static ArchiveMinSize: number;
    static ArchiveMaxSize: number;
    static InfusionName: string;
    static NameMaxLength: number;
    static UrlMaxLength: number;
    static ArgsMax: number;
    static AddressMaxSize: number;
    static ScriptMaxSize: number;
}
//# sourceMappingURL=DomainSettings.d.ts.map