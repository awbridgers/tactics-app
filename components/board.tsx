import React, {
  Ref,
  RefAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Square, Piece, Color, Move} from 'chess.js';
import {
  View,
  Text,
  ViewStyle,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import {chooseImage} from '../helpers/chooseImage';
import {convertCoords, deConvertCoords} from '../helpers/convertCoords';
import Svg, {Defs, Line, Marker, Path} from 'react-native-svg';
import {Chess} from 'chess.js';

type Props = {
  currentBoard: (Piece | null)[][];
  clickSquare: (id: Square) => void;
  selectedSquare: Square | undefined;
  legalMoves: Map<Square, Move>;
  prevMove: {from: Square; to: Square} | null;
  playerColor: Color;
  hint: Square | null;
};

const Board = ({
  currentBoard,
  clickSquare,
  selectedSquare,
  legalMoves,
  prevMove,
  playerColor,
  hint,
}: Props) => {
  // const [rowY, setRowY] = useState<Map<number, number>>(new Map());
  // const [colX, setColX] = useState<Map<string, number>>(new Map());
  const [squareWidth, setSquareWidth] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const chess = useRef(new Chess()).current;
  const linePos = useMemo(() => {
    let x1 = 0,
      x2 = 0,
      y1 = 0,
      y2 = 0;
    if (!squareWidth || !prevMove) return {x1, x2, y1, y2};
    const {to, from} = prevMove;
    const offset = squareWidth / 2;
    if (playerColor === 'w') {
      x1 = (from.charCodeAt(0) - 97) * squareWidth + offset;
      x2 = (to.charCodeAt(0) - 97) * squareWidth + offset;
      y1 = (8 - +from[1]) * squareWidth + offset;
      y2 = (8 - +to[1]) * squareWidth + offset;
    } else {
      x1 = (104 - from.charCodeAt(0)) * squareWidth + offset;
      x2 = (104 - to.charCodeAt(0)) * squareWidth + offset;
      y1 = (+from[1] - 1) * squareWidth + offset;
      y2 = (+to[1] - 1) * squareWidth + offset;
    }
    return {x1, x2, y1, y2};
  }, [prevMove, squareWidth, playerColor]);

  return (
    <View style={boardStyle.board}>
      {currentBoard.map((row, i) => {
        return (
          <View style={boardStyle.rank} key={i}>
            {row.map((square, j) => {
              const id =
                playerColor === 'w'
                  ? (`${String.fromCharCode(j + 97)}${8 - i}` as Square)
                  : (`${String.fromCharCode(104 - j)}${i + 1}` as Square);

              return (
                <Pressable
                  accessibilityRole="button"
                  style={boardStyle.square}
                  onPress={(e) => clickSquare(id)}
                  key={j}
                  testID={id}
                  id={id}
                  onLayout={(e) => {
                    const {height, width} = e.nativeEvent.layout;
                    if (!squareWidth) setSquareWidth(width);
                  }}
                >
                  <View
                    style={
                      chess.squareColor(id) === 'light'
                        ? boardStyle.lightSquare
                        : boardStyle.darkSquare
                    }
                    testID="square"
                  >
                    {/* put the file label on the 1st rank  */}
                    {i === 7 && (
                      <View style={boardStyle.coordFile}>
                        <Text>{id[0]}</Text>
                      </View>
                    )}
                    {/* put the rank label on the first file */}
                    {j === 0 && (
                      <View style={boardStyle.coordRank}>
                        <Text>{id[1]}</Text>
                      </View>
                    )}
                    {/* Put border around the selected square */}
                    {(selectedSquare === id || hint === id) && (
                      <View
                        style={boardStyle.selectedSquare}
                        testID="selected"
                      ></View>
                    )}
                    {/* Show the places the selected piece can move with a dot */}
                    {legalMoves.has(id) && (
                      <View
                        style={boardStyle.legalMoveSquare}
                        testID="legalMove"
                      ></View>
                    )}
                    {/* Put a piece image on squares with a piece */}
                    {square && (
                      <Image
                        source={chooseImage(square.type, square.color)}
                        style={boardStyle.image}
                        testID={'pieceImage'}
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        );
      })}
      <Svg style={{position: 'absolute', pointerEvents: 'none'}}>
        <Defs>
          <Marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <Path d="M 0 0 L 10 5 L 0 10 z" stroke={'red'} fill={'red'} />
          </Marker>
        </Defs>
        {prevMove && (
          <Path
            d={`M ${linePos.x1} ${linePos.y1} L ${linePos.x2} ${linePos.y2}`}
            stroke={'red'}
            strokeWidth={4}
            strokeLinecap="butt"
            markerEnd="url(#arrow)"
            testID = 'path'
          />
          // <Line
          //   stroke={'red'}
          //   strokeWidth={4}
          //   x1={linePos.x1}
          //   x2={linePos.x2}
          //   y1={linePos.y1}
          //   y2={linePos.y2}
          //   markerEnd="url(#arrow)"
          //   strokeLinecap='butt'
          // />
        )}
      </Svg>
    </View>
  );
};

export default Board;

const boardStyle = StyleSheet.create({
  board: {
    width: '100%',
  },
  rank: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
  },
  square: {
    flex: 1,
    aspectRatio: 1,
  },
  lightSquare: {
    backgroundColor: '#EDD6B0',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkSquare: {
    backgroundColor: '#B88762',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSquare: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderWidth: 4,
    borderColor: 'yellow',
  },
  image: {
    resizeMode: 'center',
    height: '90%',
    width: '90%',
  },
  legalMoveSquare: {
    position: 'absolute',
    width: '15%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: 'green',
    zIndex: 1,
  },
  coordFile: {
    position: 'absolute',
    right: 2,
    bottom: 0,
  },
  coordRank: {
    position: 'absolute',
    left: 2,
    top: 2,
  },
  promote: {
    position: 'absolute',
    margin: 'auto',
    zIndex: 3,
    backgroundColor: 'green',
    width: '100%',
  },
});
