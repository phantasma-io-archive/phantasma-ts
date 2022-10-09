import { ScriptBuilder } from "../vm";

export class EasyScript {

    script: ScriptBuilder;
    minimumFee: string; 
    gasLimit: string; 

    constructor(_minimumFee: string = '100000', _gasLimit: string = '900') {

        //Default Gas Profile
        this.minimumFee = _minimumFee;
        this.gasLimit = _gasLimit;
    }

    async createScript(_type: string, _options: Array<any> = [null]){

        this.script = new ScriptBuilder();

        switch(_type){
            case 'interact':

                try {
                    let accountAddress: string =  _options[0];
                    let contractName: string = _options[1];
                    let methodName: string = _options[2];
                    let inputArguments: Array<string> = _options[3]
                } catch (error) {
                    console.log('%cYour contract interaction script arguments are not correct!', 'color:red');
                    return error;
                }

                return 
                this.script
                .callContract('gas', 'AllowGas', [accountAddress, this.script.nullAddress(), this.minimumFee, this.gasLimit]) //Just for good measure
                .callContract(contractName, methodName, inputArguments) //The Meat of the Script
                .callContract('gas', 'SpendGas', [accountAddress]) //Just for good measure (optional)
                .endScript();
                
            break;

            case 'invoke':

                try {
                    let contractName: string = _options[0];
                    let methodName: string = _options[1];
                    let inputArguments: Array<string> = _options[2]
                } catch (error) {
                    console.log('%cYour invoke script arguments are not correct!', 'color:red');
                    return error;
                }

                return 
                this.script
                .callContract(contractName, methodName, inputArguments) //The Meat of the Script
                .endScript();

            break;

            case 'interop':
                
                try {
                    let interopName: string = _options[0];
                    let inputArguments: Array<any> = _options[1]
                } catch (error) {
                    console.log('%cYour interop script arguments are not correct!', 'color:red');
                    return error;
                }

                return 
                this.script
                .callContract('gas', 'AllowGas', [accountAddress, this.script.nullAddress(), this.minimumFee, this.gasLimit]) //Just for good measure
                .callInterop(interopName, inputArguments)
                .callContract('gas', 'SpendGas', [accountAddress]) //Just for good measure (optional)
                .endScript();

            break;

        }



    }



}