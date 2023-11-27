import { Platform } from './Platform';
import { Governance } from './Governance';
import { Token } from './Token';
import { Chain } from './Chain';

export interface Nexus {
  name: string; //Name of the nexus
  protocol: string;
  platforms: Array<Platform>; //List of platforms
  tokens: Array<Token>; //List of tokens
  chains: Array<Chain>; //List of chains
  governance: Array<Governance>; //List of governance values
  organizations: Array<string>; //List of organizations
}
