export interface Channel {
  creatorAddress: string; //Creator of channel
  targetAddress: string; //Target of channel
  name: string; //Name of channel
  chain: string; //Chain of channel
  creationTime: number; //Creation time
  symbol: string; //Token symbol
  fee: string; //Fee of messages
  balance: string; //Estimated balance
  active: boolean; //Channel status
  index: number; //Message index
}
