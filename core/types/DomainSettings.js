"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainSettings = exports.StakeReward = exports.OrganizationTrigger = exports.TokenTrigger = exports.AccountTrigger = exports.TriggerResult = void 0;
var TriggerResult;
(function (TriggerResult) {
    TriggerResult[TriggerResult["Failure"] = 0] = "Failure";
    TriggerResult[TriggerResult["Missing"] = 1] = "Missing";
    TriggerResult[TriggerResult["Success"] = 2] = "Success";
})(TriggerResult = exports.TriggerResult || (exports.TriggerResult = {}));
var AccountTrigger;
(function (AccountTrigger) {
    AccountTrigger[AccountTrigger["OnMint"] = 0] = "OnMint";
    AccountTrigger[AccountTrigger["OnBurn"] = 1] = "OnBurn";
    AccountTrigger[AccountTrigger["OnSend"] = 2] = "OnSend";
    AccountTrigger[AccountTrigger["OnReceive"] = 3] = "OnReceive";
    AccountTrigger[AccountTrigger["OnWitness"] = 4] = "OnWitness";
    AccountTrigger[AccountTrigger["OnUpgrade"] = 5] = "OnUpgrade";
    AccountTrigger[AccountTrigger["OnMigrate"] = 6] = "OnMigrate";
    AccountTrigger[AccountTrigger["OnKill"] = 7] = "OnKill";
})(AccountTrigger = exports.AccountTrigger || (exports.AccountTrigger = {}));
var TokenTrigger;
(function (TokenTrigger) {
    TokenTrigger[TokenTrigger["OnMint"] = 0] = "OnMint";
    TokenTrigger[TokenTrigger["OnBurn"] = 1] = "OnBurn";
    TokenTrigger[TokenTrigger["OnSend"] = 2] = "OnSend";
    TokenTrigger[TokenTrigger["OnReceive"] = 3] = "OnReceive";
    TokenTrigger[TokenTrigger["OnInfuse"] = 4] = "OnInfuse";
    TokenTrigger[TokenTrigger["OnUpgrade"] = 5] = "OnUpgrade";
    TokenTrigger[TokenTrigger["OnSeries"] = 6] = "OnSeries";
    TokenTrigger[TokenTrigger["OnWrite"] = 7] = "OnWrite";
    TokenTrigger[TokenTrigger["OnMigrate"] = 8] = "OnMigrate";
    TokenTrigger[TokenTrigger["OnKill"] = 9] = "OnKill";
})(TokenTrigger = exports.TokenTrigger || (exports.TokenTrigger = {}));
var OrganizationTrigger;
(function (OrganizationTrigger) {
    OrganizationTrigger[OrganizationTrigger["OnAdd"] = 0] = "OnAdd";
    OrganizationTrigger[OrganizationTrigger["OnRemove"] = 1] = "OnRemove";
    OrganizationTrigger[OrganizationTrigger["OnUpgrade"] = 2] = "OnUpgrade";
})(OrganizationTrigger = exports.OrganizationTrigger || (exports.OrganizationTrigger = {}));
var StakeReward = /** @class */ (function () {
    function StakeReward(staker, date) {
        this.staker = staker;
        this.date = date;
    }
    return StakeReward;
}());
exports.StakeReward = StakeReward;
var DomainSettings = /** @class */ (function () {
    function DomainSettings() {
    }
    DomainSettings.LatestKnownProtocol = 9;
    DomainSettings.Phantasma20Protocol = 7;
    DomainSettings.Phantasma30Protocol = 8;
    DomainSettings.MaxTxPerBlock = 1024;
    DomainSettings.MaxOracleEntriesPerBlock = 5120;
    DomainSettings.MaxEventsPerBlock = 2048;
    DomainSettings.MaxEventsPerTx = 8096;
    DomainSettings.MaxTriggerLoop = 5;
    DomainSettings.MAX_TOKEN_DECIMALS = 18;
    DomainSettings.DefaultMinimumGasFee = 100000;
    DomainSettings.InitialValidatorCount = 4;
    DomainSettings.FuelTokenSymbol = 'KCAL';
    DomainSettings.FuelTokenName = 'Phantasma Energy';
    DomainSettings.FuelTokenDecimals = 10;
    DomainSettings.NexusMainnet = 'mainnet';
    DomainSettings.NexusTestnet = 'testnet';
    DomainSettings.StakingTokenSymbol = 'SOUL';
    DomainSettings.StakingTokenName = 'Phantasma Stake';
    DomainSettings.StakingTokenDecimals = 8;
    DomainSettings.FiatTokenSymbol = 'USD';
    DomainSettings.FiatTokenName = 'Dollars';
    DomainSettings.FiatTokenDecimals = 8;
    DomainSettings.RewardTokenSymbol = 'CROWN';
    DomainSettings.RewardTokenName = 'Phantasma Crown';
    DomainSettings.LiquidityTokenSymbol = 'LP';
    DomainSettings.LiquidityTokenName = 'Phantasma Liquidity';
    DomainSettings.LiquidityTokenDecimals = 8;
    DomainSettings.FuelPerContractDeployTag = 'nexus.contract.cost';
    DomainSettings.FuelPerTokenDeployTag = 'nexus.token.cost';
    DomainSettings.FuelPerOrganizationDeployTag = 'nexus.organization.cost';
    DomainSettings.SystemTokens = [
        DomainSettings.FuelTokenSymbol,
        DomainSettings.StakingTokenSymbol,
        DomainSettings.FiatTokenSymbol,
        DomainSettings.RewardTokenSymbol,
        DomainSettings.LiquidityTokenSymbol,
    ];
    DomainSettings.RootChainName = 'main';
    DomainSettings.ValidatorsOrganizationName = 'validators';
    DomainSettings.MastersOrganizationName = 'masters';
    DomainSettings.StakersOrganizationName = 'stakers';
    DomainSettings.PhantomForceOrganizationName = 'phantom_force';
    //public static PlatformSupply = UnitConversion.ToBigInteger(100000000, FuelTokenDecimals);
    DomainSettings.PlatformName = 'phantasma';
    DomainSettings.ArchiveMinSize = 64;
    DomainSettings.ArchiveMaxSize = 104857600;
    //public static ArchiveBlockSize = MerkleTree.ChunkSize;
    DomainSettings.InfusionName = 'infusion';
    //public static InfusionAddress = SmartContract.GetAddressFromContractName(InfusionName);
    DomainSettings.NameMaxLength = 255;
    DomainSettings.UrlMaxLength = 2048;
    DomainSettings.ArgsMax = 64;
    DomainSettings.AddressMaxSize = 34;
    DomainSettings.ScriptMaxSize = 32767;
    return DomainSettings;
}());
exports.DomainSettings = DomainSettings;
