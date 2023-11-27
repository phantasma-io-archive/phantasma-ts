import { ABIEvent } from './ABIEvent';
import { ABIMethod } from './ABIMethod';

export interface Contract {
  name: string;
  address: string;
  owner: string;
  script: string;
  methods?: Array<ABIMethod>;
  events?: Array<ABIEvent>;
}
