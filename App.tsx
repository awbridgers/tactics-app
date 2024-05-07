import React, {useEffect, useRef, useState} from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import {PGNFormat, blankPGN} from './types/PGN';
import {Chess, Color, Move, PieceSymbol, Square} from 'chess.js';
import {PGNMove} from 'pgn-parser';
import {convertCoords} from './helpers/convertCoords';
import * as Linking from 'expo-linking';
import {View, Text, Modal, useColorScheme, StyleSheet} from 'react-native';
import Board from './components/board';
import Controls from './components/controls';
import Promote from './components/promote';
import {tactics} from './tactics';
import {StatusBar} from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const App = () => {
  const chess = useRef(new Chess()).current;
  const moveHistory = useRef<string>('');
  const currentTactic = useRef<{fen: string; solution: Move[]}>();
  const [selectedSquare, setSelectedSquare] = useState<Square | undefined>();
  const [legalMoveSquares, setlegalMoveSquares] = useState<Map<Square, Move>>(
    new Map()
  );
  const [playerColor, setPlayerColor] = useState<Color>('w');
  const [moveResult, setMoveResults] = useState<'right' | 'wrong' | ''>('');
  const [moveList, setMoveList] = useState<string[]>([]);
  const [showingSolution, setShowingSolution] = useState<boolean>(false);
  const [tacticActive, setTactiveActive] = useState<boolean>(false);
  const [showPromo, setShowPromo] = useState<boolean>(false);
  const [prevMove, setPrevMove] = useState<{from: Square; to: Square} | null>(
    null
  );
  const [hint, setHint] = useState<Square | null>(null);
  const [buttonsActive, setButtonsActive] = useState<boolean>(true);
  const [ready, setReady] = useState<boolean>(false)
  const playerMove = useRef<boolean>(false);
  const solution = useRef<Move[]>([]);
  const promoInfo = useRef<Move | null>(null);
  const board =
    playerColor === 'w'
      ? chess.board()
      : chess
          .board()
          .reverse()
          .map((x) => x.reverse());

  const loadTactic = async () => {
    //try to load a random tactic from the DB
    const random = Math.floor(Math.random() * tactics.length); //NOTE: 4740 is CURRENT number of tactics in the DB
    const tactic = tactics[random];
    //set up the solution by loading the tactic as a pgn and storing the move history
    //then just load the FEN for starting position
    const solutionString = tactic.pgn.map((x) => x.move).join(' ');
    chess.loadPgn(`[FEN "${tactic.fen}"]\n \n ${solutionString}`);
    solution.current = chess.history({verbose: true});
    //start the game
    chess.load(tactic.fen);
    playerMove.current = true;
    setShowingSolution(false);
    currentTactic.current = {fen: tactic.fen, solution: solution.current};
    setPlayerColor(chess.turn());
    setMoveList([]);
    setlegalMoveSquares(new Map());
    setSelectedSquare(undefined);
    setMoveResults('');
    setHint(null);
    setTactiveActive(true);
    setPrevMove(null);
    setButtonsActive(true);
  };
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }, []);
  //show the splash screen until the board is ready
  useEffect(()=>{
    const endSplash = async() =>{
      await SplashScreen.hideAsync()
    }
    if(ready){
      endSplash()
    }
  },[ready])
  //load a tactic to start the game
  useEffect(() => {
    loadTactic();
  }, []);
  

  const clickSquare = (coordinate: Square) => {
    if (playerMove.current && tacticActive) {
      if (!selectedSquare) {
        //this is the first click
        const pieceOnSquare = chess.get(coordinate);
        //only target square if there is a player's piece on it
        if (pieceOnSquare && pieceOnSquare.color === playerColor) {
          setSelectedSquare(coordinate);
          const legalMoveList: [Square, Move][] = chess
            .moves({verbose: true, square: coordinate})
            .map((x) => {
              const {to} = x;
              return [to, x];
            });
          setlegalMoveSquares(new Map(legalMoveList));
        }
      } else {
        //it is the secondClick
        if (legalMoveSquares.has(coordinate)) {
          //LEGAL MOVE
          const moveInfo = legalMoveSquares.get(coordinate);
          if (moveInfo.promotion) {
            setShowPromo(true);
            promoInfo.current = moveInfo;
          } else {
            movePiece(selectedSquare, coordinate);
          }
        } else if (coordinate === selectedSquare) {
          //NOT A LEGAL MOVE BUT
          //click on the same piece
          setSelectedSquare(undefined);
          setlegalMoveSquares(new Map());
        } else if (chess.get(coordinate).color === playerColor) {
          //not a legal move
          //its a click on other piece, switch to that piece
          setSelectedSquare(coordinate);
          const legalMoveList: [Square, Move][] = chess
            .moves({verbose: true, square: coordinate})
            .map((x) => {
              const {to} = x;
              return [to, x];
            });
          setlegalMoveSquares(new Map(legalMoveList));
        } else {
          //if it is a click on a random score, undo peice selection
          setSelectedSquare(undefined);
          setlegalMoveSquares(new Map());
        }
      }
    }
  };
  const computerMove = () => {
    setButtonsActive(false);
    setTimeout(() => {
      const {to, from} = chess.move(solution.current[0]);
      playerMove.current = true;
      solution.current = solution.current.slice(1);
      setMoveResults('');
      setPrevMove({to, from});
      setButtonsActive(true);
    }, 1000);
  };
  const showHint = () => {
    if (!hint) {
      //first time clicking hint
      setHint(solution.current[0].from);
      setSelectedSquare(undefined);
      setlegalMoveSquares(new Map());
    } else {
      //second time pressing, make the move
      const nextMove = solution.current[0].san;
      const move = chess.move(nextMove);
      setMoveList((prev) => [...prev, nextMove]);
      setPrevMove({from: move.from, to: move.to});
      setHint(null);
      setSelectedSquare(undefined);
      setlegalMoveSquares(new Map());
      if (solution.current.length === 1) {
        //this was the last move
        setTactiveActive(false);
        solution.current = [];
      } else {
        //there is more to the solution
        solution.current = solution.current.slice(1);
        computerMove();
      }
    }
  };
  const showSolution = () => {
    setShowingSolution(true);
    setTactiveActive(false);
    setHint(null);
    setlegalMoveSquares(new Map());
    setSelectedSquare(null)
    setTimeout(() => {
      const nextMove = solution.current[0].san;
      const move = chess.move(nextMove);
      setMoveList((prev) => [...prev, nextMove]);
      setPrevMove({from: move.from, to: move.to});
      if (solution.current.length > 1) {
        solution.current = solution.current.slice(1);
        showSolution();
      } else {
        setShowingSolution(false);
      }
    }, 1000);
  };
  const checkMove = (move: Move) => {
    const nextMove = solution.current[0].san;
    if (nextMove === move.san) {
      //this is the correct move!
      moveHistory.current = chess.fen();
      setPrevMove({from: move.from, to: move.to});
      setHint(null);
      if (solution.current.length === 1) {
        //this was the last move
        setTactiveActive(false);
        solution.current = [];
      } else {
        //there is more to the solution
        solution.current = solution.current.slice(1);
        computerMove();
      }
      setMoveResults('right');
      setMoveList((prev) => [...prev, nextMove]);
    } else {
      //this move was wrong!

      setTimeout(() => {
        chess.load(moveHistory.current);
        playerMove.current = true;
        setMoveResults('wrong');
      }, 500);
    }
  };
  const movePiece = (
    from: Square,
    to: Square,
    promo: Exclude<PieceSymbol, 'p'> = 'q'
  ) => {
    moveHistory.current = chess.fen();
    setShowPromo(false);
    const move = chess.move({to: to, from: from, promotion: promo});
    setSelectedSquare(undefined);
    setlegalMoveSquares(new Map());
    setMoveResults('');
    playerMove.current = false;
    checkMove(move);
  };

  const analysis = () => {
    Linking.openURL(
      `https://lichess.org/analysis/${currentTactic.current.fen}`
    );
  };
  const retry = () => {
    playerMove.current = true;
    solution.current = currentTactic.current.solution;
    chess.load(currentTactic.current.fen);
    setTactiveActive(true);
    setMoveResults('');
    setMoveList([]);
    setPrevMove(null);
    setButtonsActive(true);
  };
  const cancelPromo = () => {
    setShowPromo(false);
    setSelectedSquare(null);
    setlegalMoveSquares(new Map());
    promoInfo.current = null;
  };

  return (
    <View testID="app" style={gameStyle.container} onLayout={()=>setReady(true)}>
      <StatusBar style="light" />
      <Modal visible={showPromo} animationType="slide" transparent>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Promote
            color={playerColor}
            onPress={movePiece}
            move={promoInfo.current}
            cancel={cancelPromo}
          ></Promote>
        </View>
      </Modal>
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
        currentBoard={board}
        clickSquare={clickSquare}
        selectedSquare={selectedSquare}
        legalMoves={legalMoveSquares}
        prevMove={prevMove}
        playerColor={playerColor}
        hint={hint}
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
          <Text style={gameStyle.solution}>{moveList.join(' ')}</Text>
        </View>
        <View style={{flex: 3, marginBottom: 10}}>
          <Controls
            showingSolution={showingSolution}
            tacticActive={tacticActive}
            viewSolution={showSolution}
            next={loadTactic}
            analysis={analysis}
            retry={retry}
            hint={showHint}
            active={buttonsActive}
          />
        </View>
      </View>
    </View>
  );
};

export default App;

const gameStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#282828',
  },
  solution: {
    fontSize: 20,
    color: '#B3b3b3',
  },
  toMove: {
    fontSize: 26,
    color: '#b3b3b3',
    textAlign: 'center',
  },
  incorrect: {
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    fontSize: 20,
    textAlign: 'center',
  },
  correct: {
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    fontSize: 20,
    textAlign: 'center',
  },
});
