//Imports PhantasmaJS
import * as backBone from './core/index';

//Exports PhantasmaJS
export * as backBone from './core/index';

//Exports Host Config Generator
export class hostConfiguration {

    //Variable Initilizers
    rpc: string;
    peerList: string;
    nexus: string;
    chain: string;

    //Constructs The Host Config
    constructor(
        
        //Set Defualt Values
        rpcURL: string = 'https://seed.ghostdevs.com:7077/rpc',
        jsonPeerList: string = 'https://ghostdevs.com/getpeers.json',
        nexus: string = 'mainnet',
        chain: string = 'main'

    ) {

        //Set Values
        this.rpc = rpcURL;
        this.peerList = jsonPeerList;
        this.nexus = nexus;
        this.chain = chain;

    };

};

//Exports The SDK
export class phantasma {

    //Initillize Some Variables
    config: hostConfiguration;
    rpc: backBone.PhantasmaAPI;

    //Constructs The BigBoi
    constructor(config: hostConfiguration = new hostConfiguration) {
        
        //Sets The Config
        this.config = config;

        //Sets The RPC Host
        this.rpc = new backBone.PhantasmaAPI(this.config.rpc, this.config.peerList);
    };

    
};
