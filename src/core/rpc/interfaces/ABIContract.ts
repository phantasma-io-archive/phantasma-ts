import { ABIMethod } from './ABIMethod';

export interface ABIContract {
  name: string; //Name of contract
  methods: Array<ABIMethod>; //List of methods
}
