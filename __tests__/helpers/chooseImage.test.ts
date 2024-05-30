import { PieceSymbol } from 'chess.js';
import { chooseImage } from '../../helpers/chooseImage';

jest.mock('../../helpers/chooseImage');

describe('choosing the right image',()=>{
  it('should return a white king', () => { 
    expect(chooseImage('k', 'w' )).toHaveProperty('uri', 'whiteKing2')
   })
   it('should return a white queen', () => { 
    expect(chooseImage('q', 'w' )).toHaveProperty('uri', 'whiteQueen2')
   })
   it('should return a white rook', () => { 
    expect(chooseImage('r', 'w' )).toHaveProperty('uri', 'whiteRook2')
   })
   it('should return a white bishop', () => { 
    expect(chooseImage('b', 'w' )).toHaveProperty('uri', 'whiteBishop2')
   })
   it('should return a white knight', () => { 
    expect(chooseImage('n', 'w' )).toHaveProperty('uri', 'whiteKnight2')
   })
   it('should return a white pawn', () => { 
    expect(chooseImage('p', 'w' )).toHaveProperty('uri', 'whitePawn2')
   })
   it('should return a black king', () => { 
    expect(chooseImage('k', 'b' )).toHaveProperty('uri', 'blackKing2')
   })
   it('should return a black queen', () => { 
    expect(chooseImage('q', 'b' )).toHaveProperty('uri', 'blackQueen2')
   })
   it('should return a black rook', () => { 
    expect(chooseImage('r', 'b' )).toHaveProperty('uri', 'blackRook2')
   })
   it('should return a black bishop', () => { 
    expect(chooseImage('b', 'b' )).toHaveProperty('uri', 'blackBishop2')
   })
   it('should return a black knight', () => { 
    expect(chooseImage('n', 'b' )).toHaveProperty('uri', 'blackKnight2')
   })
   it('should return a black pawn', () => { 
    expect(chooseImage('p', 'b' )).toHaveProperty('uri', 'blackPawn2')
   })
})