import { PGNMove } from 'pgn-parser';

export interface PGNFormat {
  event?: string;
  site?: string;
  date?: string;
  round?: string;
  white?: string;
  black?: string;
  result?: string;
  fen: string;
  pgn: PGNMove[];
}

export const blankPGN:PGNFormat = {
  fen: '8/8/8/8/8/8/8/8 w - - 0 1',
  pgn: []
}