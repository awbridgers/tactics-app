import {PieceSymbol} from 'chess.js'
export const chooseImage = (piece: PieceSymbol, color: 'w' | 'b'): {uri: string} => {
  if (color === 'b') {
    switch (piece) {
      case 'k':
        return {uri: 'blackKing2'};
      case 'q':
        return {uri: 'blackQueen2'};
      case 'b':
        return {uri: 'blackBishop2'};
      case 'n':
        return {uri: 'blackKnight2'};
      case 'r':
        return {uri: 'blackRook2'};
      case 'p':
        return {uri: 'blackPawn2'};
    }
  } else {
    switch (piece) {
      case 'k':
        return {uri: 'whiteKing2'};
      case 'q':
        return {uri: 'whiteQueen2'};
      case 'b':
        return {uri: 'whiteBishop2'};
      case 'n':
        return {uri: 'whiteKnight2'};
      case 'r':
        return {uri: 'whiteRook2'};
      case 'p':
        return {uri: 'whitePawn2'};
    }
  }
};