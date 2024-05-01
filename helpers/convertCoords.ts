import { Square } from 'chess.js';

export const convertCoords = (index: number): Square => {
    const letter = String.fromCharCode(Math.floor(index / 8) + 97);
    const number = (index % 8) + 1
  return `${letter}${number}` as Square
}

export const deConvertCoords = (square: Square) =>{
  const file = square.charCodeAt(0) - 97
  const rank = +square[1];
  return file*8 + rank
}