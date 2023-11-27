export interface Archive {
  name: string;
  hash: string; //Archive hash
  time: number;
  size: number; //Size of archive in bytes
  encryption: string;
  blockCount: number; //Number of blocks
  missingBlocks: Array<number>;
  owners: Array<string>;
}
