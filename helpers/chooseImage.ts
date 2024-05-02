import {PieceSymbol} from 'chess.js';
import {ImageSourcePropType} from 'react-native';

export const chooseImage = (
  piece: PieceSymbol,
  color: 'w' | 'b'
): ImageSourcePropType => {
  if (color === 'b') {
    switch (piece) {
      case 'k':
        return require('../images/blackKing.png');
      case 'q':
        return require('../images/blackQueen.png');
      case 'b':
        return require('../images/blackBishop.png');
      case 'n':
        return require('../images/blackKnight.png');
      case 'r':
        return require('../images/blackRook.png');
      case 'p':
        return require('../images/blackPawn.png');
      default:
        return require('../images/blackPawn.png');
    }
  } else {
    switch (piece) {
      case 'k':
        return require('../images/whiteKing.png');
      case 'q':
        return require('../images/whiteQueen.png');
      case 'b':
        return require('../images/whiteBishop.png');
      case 'n':
        return require('../images/whiteKnight.png');
      case 'r':
        return require('../images/whiteRook.png');
      case 'p':
        return require('../images/whitePawn.png');
      default:
        return require('../images/blackPawn.png');
    }
  }
};
