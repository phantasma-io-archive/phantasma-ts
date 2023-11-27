export interface Oracle {
  url: string; //URL that was read by the oracle
  content: string; //Byte array content read by the oracle, encoded as hex string
}
