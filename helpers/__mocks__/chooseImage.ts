import {PieceType} from 'chess.js'
export const chooseImage = (piece: PieceType, color: 'w' | 'b'): string => {
  if (color === 'b') {
    switch (piece) {
      case 'k':
        return 'blackKing2';
      case 'q':
        return 'blackQueen2';
      case 'b':
        return 'blackBishop2';
      case 'n':
        return 'blackKnight2';
      case 'r':
        return 'blackRook2';
      case 'p':
        return 'blackPawn2';
    }
  } else {
    switch (piece) {
      case 'k':
        return 'whiteKing2';
      case 'q':
        return 'whiteQueen2';
      case 'b':
        return 'whiteBishop2';
      case 'n':
        return 'whiteKnight2';
      case 'r':
        return 'whiteRook2';
      case 'p':
        return 'whitePawn2';
    }
  }
};