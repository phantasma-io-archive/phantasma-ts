import { LeaderboardRow } from './LeaderboardRow';

export interface Leaderboard {
  name: string;
  rows: Array<LeaderboardRow>;
}
