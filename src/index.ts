import * as api from './core/index';

export class hostConfiguration {

    //Variable Initilizers
    rpc: string;
    peerList: string;
    nexus: string;
    chain: string;

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


export class phantasma {

    //Initillize Some Variables
    config: hostConfiguration;
    rpc: api.PhantasmaAPI;

    //Constructs The BigBoi
    constructor(config: hostConfiguration = new hostConfiguration) {
        
        //Sets The Config
        this.config = config;

        //Sets The RPC Host
        this.rpc = new api.PhantasmaAPI(this.config.rpc, this.config.peerList);
    };

};