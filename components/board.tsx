import React from 'react';
import {Square, Piece, Color, Move} from 'chess.js';
import {
  View,
  Text,
  ViewStyle,
  Image,
  Pressable,
} from 'react-native';
import style from '../styles/board';
import {chooseImage} from '../helpers/chooseImage';
import {convertCoords} from '../helpers/convertCoords';
import boardStyle from '../styles/board';

type Props = {
  currentBoard: (Piece | null)[][];
  clickSquare: (i: number, j: number) => void;
  selectedSquare: Square | undefined;
  legalMoves: Map<Square, Move>;
  showPromo: boolean,
  color: Color
};

const Board = ({
  currentBoard,
  clickSquare,
  selectedSquare,
  legalMoves,
  showPromo,
  color
}:Props) => {
  const styleSquare = (rank: number, file: number): ViewStyle[] => {
    let squareStyle: ViewStyle[] = [];
    if (rank % 2 === 0) {
      //if rank is even, evens are light and odds are dark
      if (file % 2 === 0) {
        squareStyle.push(style.lightSquare);
      } else {
        squareStyle.push(style.darkSquare);
      }
    } else {
      //if rank is odd, odds are light and evens are dark
        if (file % 2 === 0) {
          squareStyle.push(style.darkSquare);
        } else {
          squareStyle.push(style.lightSquare);
        }
      
    }
    return squareStyle;
  };
  const isSelectedSquare = (i: number, j: number): boolean => {
    const coordinate = convertCoords(i, j);
    return coordinate === selectedSquare;
  };
  const isLegalMoveSquare = (i: number, j: number): boolean => {
    const coordinate = convertCoords(i, j);
    return legalMoves.has(coordinate);
  };
  return (
    <View style = {boardStyle.board}>
      {currentBoard.map((row, i) => {
        return (
          <View style={style.rank} key={i}>
            {row.map((square, j) => {
              return (
                <Pressable
                  style={style.square}
                  onPress={() => clickSquare(i, j)}
                  key={j}
                  testID={convertCoords(i, j)}
                >
                  <View style={styleSquare(i, j)} testID = 'square'>
                    {i === 7 && <View style = {boardStyle.coordFile}><Text>{convertCoords(i,j)[0]}</Text></View>}
                    {j===0 && <View style = {boardStyle.coordRank}><Text>{convertCoords(i,j)[1]}</Text></View>}
                    {isSelectedSquare(i, j) && (
                      <View style={style.selectedSquare} testID = 'selected'></View>
                    )}
                    {isLegalMoveSquare(i, j) && (
                      <View style={style.legalMoveSquare} testID = 'legalMove'></View>
                    )}
                    {square && (
                      <Image
                        source={chooseImage(square.type, square.color)}
                        style={style.image}
                        testID = {'pieceImage'}
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

export default Board;
