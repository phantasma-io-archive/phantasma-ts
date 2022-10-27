import { PhantasmaLink } from "./phantasmaLink";
import { EasyScript } from "./easyScript"

export class EasyConnect{

    requiredVersion: number;
    platform: string;
    providerHint: string;
    link: PhantasmaLink;
    connected: boolean;
    scriptBuilder: EasyScript;


    constructor(_options: Array<string> = null){

        this.link = new PhantasmaLink("easyConnect", false);
        this.connected = false;
        this.requiredVersion = 2;

        if(_options == null){
            this.setConfig('auto');
        }else{

            try {
                this.requiredVersion = Number(_options[0]);
                this.platform = _options[1];
                this.providerHint = _options[2];
            } catch (error) {
                console.log(error);
            }

        }
        this.scriptBuilder = new EasyScript();
    }

    setConfig(_provider: string){
        
        this.requiredVersion = 2;
        this.platform = "phantasma";

        switch(_provider){
            case 'auto':
                // @ts-ignore
                if (!!window.PhantasmaLinkSocket == true) {
                    this.setConfig('ecto');
                } else {
                    this.providerHint = "";
                }
            break;

            case 'ecto':
                this.providerHint = "ecto";
            break;

            case 'poltergeist':
                this.providerHint = "poltergeist";
            break;
        }
    }
    
    connect(onSuccess: any = (data) => {}, onFail: any = (data) => {console.log('%cError: ' + data, 'color:red')}){
        
        let that = this;

        this.link.login(function (data) {

            //Console Logging for Debugging Purposes
            if (data) {
                that.connected = true;
                onSuccess(data);
                console.log('%c[EasyConnect Connected]', 'color:green');
                console.log('Wallet Address \'' + that.link.account.address + '\' connected via ' + that.link.wallet);
            } else {
                onFail();
                console.log('EasyConnect could not connect to wallet');
            };

        }, onFail, this.providerHint);
    }

    disconnect(_message: string = 'Graceful Disconect'){
        this.link.disconnect(_message);
        this.connected = false;
    }

    

    async query(_type: string = null, _arguments: Array<string> = null, _callback: any = (data) => {console.log(data)}){
        
        if(this.connected == true){
            switch(_type){

                case 'account':
                    let account = this.link.account;
                    _callback(account);
                    return account;
                break;

                case 'name':
                    let name = this.link.account.name;
                    _callback(name);
                    return name;
                break;

                case 'balances':
                    let balances = this.link.account.balances
                    _callback(balances);
                    return balances;
                break;

                case 'walletAddress':
                    let walletAddress = this.link.account.address;
                    _callback(walletAddress);
                    return walletAddress;
                break;

                case 'avatar':
                    let avatar = this.link.account.avatar;
                    _callback(avatar);
                    return avatar;
                break;

                case 'tokenBalance':
                    //let token = _arguments[0];
                    //return this.link.accounts[]
                break;


            }

        }else{
            console.log('%cWallet is not connected', 'color:red');
        }
    }


    






}

