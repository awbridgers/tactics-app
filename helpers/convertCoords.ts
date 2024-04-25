import { Square } from 'chess.js';

export const convertCoords = (file: number, rank: number): Square => {
  const letter = String.fromCharCode(rank + 97);
  const number = 8-file;
  return `${letter}${number}` as Square
}
