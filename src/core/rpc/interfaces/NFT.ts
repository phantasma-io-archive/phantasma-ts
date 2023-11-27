import { KeyValue } from './KeyValue';

export interface NFT {
  ID: string;
  series: string;
  mint: string;
  chainName: string;
  ownerAddress: string;
  creatorAddress: string;
  ram: string;
  rom: string;
  infusion: KeyValue[];
  properties: KeyValue[];
}
