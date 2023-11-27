import { Archive } from './Archive';

export interface Storage {
  available: number;
  used: number;
  avatar: string;
  archives: Array<Archive>;
}
