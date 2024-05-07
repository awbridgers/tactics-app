declare module 'pgn-parser'{
  export interface Headers{
    name: string;
    value: string;
  }
  export interface PGNMove{
    move:string;
    move_number?: number;
    ravs?: {moves: PGNMove[]};
    comments?: string[];
  }
  export interface PGNParse{
    comments: string| null
    comments_above_header: string| null
    headers: Headers[];
    results: string;
    moves: Array<PGNMove>;
  }
  export function parse (pgn: string):PGNParse[];
}