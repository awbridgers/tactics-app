import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  Text,
  View,
} from 'react-native';
import Board from './components/board';
import {Chess, Square, PieceSymbol, Move} from 'chess.js';
import {convertCoords} from './helpers/convertCoords';
import 'firebase/app';
import {child, get, getDatabase, ref} from 'firebase/database'
import {FirebaseContext} from './helpers/firebase';
import {PGNFormat, blankPGN} from './types/PGN';
import {PGNMove} from 'pgn-parser';
import gameStyle from './styles/game';
import pgnString from './helpers/pgnString';
import Controls from './components/controls';
import * as Linking from 'expo-linking';
import config from './config';
import { initializeApp } from 'firebase/app';



const Game = () => {
  const firebase = useContext(FirebaseContext);
  const chess = useRef(new Chess('8/8/8/8/8/8/8/8 w - - 0 1')).current;
  const moveHistory = useRef<string>('8/8/8/8/8/8/8/8 w - - 0 1');
  const currentTactic = useRef<PGNFormat>(blankPGN);
  const [selectedSquare, setSelectedSquare] = useState<Square | undefined>();
  const [secondClick, setSecondClick] = useState<boolean>(false);
  const [legalMoveSquares, setlegalMoveSquares] = useState<Square[]>([]);
  const [playerMove, setPlayerMove] = useState<boolean>(true);
  const [tacticActive, setTacticActive] = useState<boolean>(false);
  const [playerColor, setPlayerColor] = useState<string>('w');
  const [solution, setSolution] = useState<PGNMove[]>([]);
  const [attemptedMove, setAttemptedMove] = useState<string>();
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [moveResult, setMoveResults] = useState<'right' | 'wrong' | ''>('');
  const [loadNewTactic, setLoadNewTactic] = useState<boolean>(true);
  const db = getDatabase();
  //load a tactic to start the game
  useEffect(() => {
    const loadTactic = async () => {
      //try to load a random tactic from the DB
      const random = Math.floor(Math.random() * 4740); //NOTE: 4740 is CURRENT number of tactics in the DB
      //console.log(random);
      const tacticRef = child(ref(db), `tacticsList/${random}`)
      const fetch = await get(tacticRef)
      const tactic = await fetch.val();
      //start the game
      chess.load(tactic.fen);
      setPlayerColor(chess.turn());
      setAttemptedMove(undefined);
      setMoveResults('');
      setPlayerMove(true);
      setSolution(tactic.pgn);
      setTacticActive(true);
      currentTactic.current = tactic;
    };
    if (loadNewTactic) {
      //loadTactic();
      //setLoadNewTactic(false);
    }
  }, [loadNewTactic]);
  //Playout the solution if the button has been pressed
  useEffect(() => {
    if (!tacticActive && showSolution) {
      if (solution.length > 0) {
        const theAnswer = [...solution];
        const nextMove = theAnswer.shift()!;
        setTimeout(() => {
          chess.move(nextMove.move);
          setSolution(theAnswer);
        }, 1000);
      } else {
        setShowSolution(false);
      }
    }
  }, [tacticActive, showSolution, solution]);
  //show the squares the selected piece can move to
  useEffect(() => {
    if (tacticActive) {
      if (!selectedSquare) {
        setlegalMoveSquares([]);
      } else {
        setlegalMoveSquares(
          chess.moves({verbose: true, square: selectedSquare}).map((x) => x.to)
        );
      }
    }
  }, [selectedSquare, tacticActive]);
  //check to see if the player move is correct
  useEffect(() => {
    if (attemptedMove && tacticActive) {
      const theAnswer = [...solution]; //the remaining moves in the answer
      if (theAnswer[0].move.includes(attemptedMove)) {
        //correct move
        setMoveResults('right');
        if (theAnswer.length === 1) {
          //the last move of the answer
          setTacticActive(false);
          setShowSolution(false);
        } else {
          //there are more moves
          theAnswer.shift();
          setSolution(theAnswer);
          setPlayerMove(false);
          setAttemptedMove(undefined);
        }
      } else {
        //incorrect move
        //console.log('incorrect move');
        setMoveResults('wrong');
        //go back and let the user try again
        setTimeout(() => {
          chess.load(moveHistory.current);
          setAttemptedMove(undefined);
          setPlayerMove(true);
        }, 1000);
      }
    }
  }, [attemptedMove, tacticActive, solution]);
  //the computer move
  useEffect(() => {
    if (!playerMove && tacticActive) {
      const theAnswer = [...solution];
      const computerMove = theAnswer.shift();
      if (computerMove) {
        setTimeout(() => {
          chess.move(computerMove.move);
          setPlayerMove(true);
          setSolution(theAnswer);
          setPlayerMove(true);
        }, 500);
      }
    }
  }, [playerMove, tacticActive, solution]);
  const clickSquare = (i: number, j: number) => {
    if (playerMove && tacticActive) {
      const coordinate = convertCoords(i, j) as Square;
      if (!secondClick) {
        const pieceOnSquare = chess.get(coordinate);
        //only target square if there is a player's piece on it
        if (pieceOnSquare && pieceOnSquare.color === playerColor) {
          setSelectedSquare(coordinate);
          setSecondClick(true);
        }
      } else {
        //it is the secondClick
        //find all the legal moves, and check if our move is in the list
        const legalMoves = chess.moves({verbose: true, square: selectedSquare});
        const moveInfo = legalMoves.find(
          (x) => x.from === selectedSquare && x.to === coordinate
        );
        //if it is a legal move, get the necessary info and then move the piece
        if (moveInfo && selectedSquare) {
          movePiece(selectedSquare, coordinate, 'q');
        } else if (coordinate === selectedSquare) {
          //click on the same piece
          setSecondClick(false);
          setSelectedSquare(undefined);
        } else {
          //its not a legal move but a click on one of the players other pieces
          const newPiece = chess.get(coordinate);
          if (newPiece && newPiece.color === playerColor) {
            setSelectedSquare(coordinate);
            setSecondClick(true);
          } else {
            setSecondClick(false);
            setSelectedSquare(undefined);
          }
        }
      }
    }
  };
  const movePiece = (
    from: Square,
    to: Square,
    promo: Exclude<PieceSymbol, 'p'>
  ) => {
    moveHistory.current = chess.fen();
    const move = chess.move({to: to, from: from, promotion: promo}) as Move;
    setAttemptedMove(move.san);
    setSelectedSquare(undefined);
    setSecondClick(false);
  };
  const viewSolution = () => {
    setTacticActive(false);
    setShowSolution(true);
  };
  const nextTactic = () => {
    setLoadNewTactic(true);
  };
  const analysis = () => {
    Linking.openURL(
      `https://lichess.org/analysis/${currentTactic.current.fen}`
    );
  };
  const retry = () => {
    setAttemptedMove(undefined);
    setMoveResults('');
    setPlayerMove(true);
    setSolution(currentTactic.current.pgn);
    setTacticActive(true);
    chess.load(currentTactic.current.fen);
  };

  return (
    <View testID="app" style={gameStyle.container}>
      <View style={{flex: 1, justifyContent: 'center', width: '100%'}}>
        <Text style={gameStyle.toMove}>
          {playerColor === 'w' ? 'White' : 'Black'} to move.
        </Text>
        {moveResult === 'wrong' && (
          <Text style={gameStyle.incorrect}>Incorrect, keep trying!</Text>
        )}
        {moveResult === 'right' && (
          <Text style={gameStyle.correct}>Great Job!</Text>
        )}
      </View>

      <Board
        currentBoard={chess.board()}
        clickSquare={clickSquare}
        selectedSquare={selectedSquare}
        legalMoves={legalMoveSquares}
      />
      <View
        style={{
          flex: 2,
          justifyContent: 'space-around',
          width: '100%',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {!tacticActive && !showSolution && (
            <Text style={gameStyle.solution}>{pgnString(chess.pgn())}</Text>
          )}
        </View>
        <View style={{flex: 3, marginBottom: 10}}>
          <Controls
            showSolution={showSolution}
            tacticActive={tacticActive}
            viewSolution={viewSolution}
            next={nextTactic}
            analysis={analysis}
            retry={retry}
          />
        </View>
      </View>
    </View>
  );
};
export default Game;
