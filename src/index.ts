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
        nexus: string = 'mainnet',
        chain: string = 'main',
        rpcURL: string = 'https://seed.ghostdevs.com:7077/rpc',
        jsonPeerList: string = 'https://ghostdevs.com/getpeers.json'

    ) {

        //Set Values
        this.rpc = rpcURL;
        this.peerList = jsonPeerList;
        this.nexus = nexus;
        this.chain = chain;

    };

};

//Exports The SDK
export class phantasmaSDK {

    //Initillize Some Variables
    config: hostConfiguration;
    rpc: backBone.PhantasmaAPI;

    //Constructs The BigBoi
    constructor(config: hostConfiguration = new hostConfiguration) {
        
        //Sets The Config
        this.config = config;

        //Sets The RPC Host
        this.rpc = new backBone.PhantasmaAPI(this.config.rpc, this.config.peerList, this.config.nexus);
    };

    //Creates A New Transaction
    async newTransaction(script: string, payload: string = null, expiration: number = 5){

        //Sets Default 5 Min Tx Expiration
        let getCurrentDate = new Date();
        let expirationDate = new Date(getCurrentDate.getTime() + expiration * 60000);

        //Creates New Transaction
        let tx = new backBone.Transaction(this.config.nexus, this.config.chain, script, expirationDate, payload);

        //Returns Your Newly Created Transaction
        return tx;
    }

};

