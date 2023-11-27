export interface Chain {
  name: string;
  address: string;
  parent: string; //Name of parent chain
  height: number; //Current chain height
  organization: string; //Chain organization
  contracts: Array<string>; //Contracts deployed in the chain
  dapps: Array<string>; //Dapps deployed in the chain
}
