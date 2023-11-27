export interface Peer {
  url: string; //URL of peer
  version: string; //Software version of peer
  flags: string; //Features supported by peer
  fee: string; //Minimum fee required by node
  pow: number; //Minimum proof of work required by node
}
