import {PieceSymbol} from 'chess.js';
import {ImageSourcePropType} from 'react-native';

export const chooseImage = (
  piece: PieceSymbol,
  color: 'w' | 'b'
): ImageSourcePropType => {
  if (color === 'b') {
    switch (piece) {
      case 'k':
        return require('../images/blackKing2.png');
      case 'q':
        return require('../images/blackQueen2.png');
      case 'b':
        return require('../images/blackBishop2.png');
      case 'n':
        return require('../images/blackKnight2.png');
      case 'r':
        return require('../images/blackRook2.png');
      case 'p':
        return require('../images/blackPawn2.png');
      default:
        return require('../images/blackPawn2.png');
    }
  } else {
    switch (piece) {
      case 'k':
        return require('../images/whiteKing2.png');
      case 'q':
        return require('../images/whiteQueen2.png');
      case 'b':
        return require('../images/whiteBishop2.png');
      case 'n':
        return require('../images/whiteKnight2.png');
      case 'r':
        return require('../images/whiteRook2.png');
      case 'p':
        return require('../images/whitePawn2.png');
      default:
        return require('../images/blackPawn2.png');
    }
  }
};
