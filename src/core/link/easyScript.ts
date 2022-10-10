import { ScriptBuilder } from "../vm";

export class EasyScript {

    sb: ScriptBuilder;
    minimumFee: string; 
    gasLimit: string; 

    constructor(_minimumFee: string = '100000', _gasLimit: string = '900') {

        //Default Gas Profile
        this.minimumFee = _minimumFee;
        this.gasLimit = _gasLimit;
    }

    async createScript(_type: string, _options: Array<any> = [null]){

        this.sb = new ScriptBuilder();

        switch(_type){
            case 'interact':


                let accountAddressInteract: string =  _options[0];
                let contractNameInteract: string = _options[1];
                let methodNameInteract: string = _options[2];
                let inputArgumentsInteract: Array<string> = _options[3]


                return (
                this.sb
                .callContract('gas', 'AllowGas', [accountAddressInteract, this.sb.nullAddress, this.minimumFee, this.gasLimit]) //Just for good measure
                .callContract(contractNameInteract, methodNameInteract, inputArgumentsInteract) //The Meat of the Script
                .callContract('gas', 'SpendGas', [accountAddressInteract]) //Just for good measure (optional)
                .endScript());
                
            break;

            case 'invoke':

                let contractNameInvoke: string = _options[0];
                let methodNameInvoke: string = _options[1];
                let inputArgumentsInvoke: Array<string> = _options[2]

                return (
                this.sb
                .callContract(contractNameInvoke, methodNameInvoke, inputArgumentsInvoke) //The Meat of the Script
                .endScript());

            break;

            case 'interop':
                
                let accountAddressInterop: string =  _options[0];
                let interopNameInterop: string = _options[1];
                let inputArgumentsInterop: Array<any> = _options[2];

                return (
                this.sb
                .callContract('gas', 'AllowGas', [accountAddressInterop, this.sb.nullAddress, this.minimumFee, this.gasLimit]) //Just for good measure
                .callInterop(interopNameInterop, inputArgumentsInterop)
                .callContract('gas', 'SpendGas', [accountAddressInterop]) //Just for good measure (optional)
                .endScript());

            break;

        }



    }



}