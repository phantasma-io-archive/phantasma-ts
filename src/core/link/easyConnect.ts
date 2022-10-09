import { PhantasmaLink } from "./phantasmaLink";

export class EasyConnect{

    requiredVersion: number;
    platform: string;
    providerHint: string;
    link: PhantasmaLink;


    constructor(_options: Array<string> = [null]){

        this.link = new PhantasmaLink("easyConnect", false);

        if(_options == [null]){
            this.setConfig('auto');
        }else{

            try {
                this.requiredVersion = _options[0];
                this.platform = _options[1];
                this.providerHint = _options[2];
            } catch (error) {
                console.log(error);
            }

        }

    }

    setConfig(_provider: string){
        
        this.requiredVersion = 2;
        this.platform = "phantasma";

        switch(_provider){
            case 'auto':
                if (!!window.PhantasmaLinkSocket == true) {
                    setConfig('ecto');
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

    connect(onSuccess: any, onFail: any){
        
        this.link.login(function (data) {

            //Console Logging for Debugging Purposes
            if (data) {
                onSuccess(data);
                console.log('%c[EasyConnect Connected]', 'color:green');
                console.log('Wallet Address \'' + this.account.address + '\' connected via ' + this.wallet);
            } else {
                onFail();
                console.log('EasyConnect could not connect to wallet');
            };

        }, this.requiredVersion, this.platform, this.providerHint);
    }







}

