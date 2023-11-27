export interface Auction {
  creatorAddress: string; //Address of auction creator
  chainAddress: string; //Address of auction chain
  startDate: number;
  endDate: number;
  baseSymbol: string;
  quoteSymbol: string;
  tokenId: string;
  price: string;
  rom: string;
  ram: string;
}
