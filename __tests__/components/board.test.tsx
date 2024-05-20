import Board from '../../components/board';
import {
  fireEvent,
  render,
  screen,
  userEvent,
  within,
} from '@testing-library/react-native';
import {Chess, Color, Move, Square} from 'chess.js';
import '@testing-library/jest-native/extend-expect';
const chess = new Chess();
import * as React from 'react'

const Props = {
  currentBoard: chess.board(),
  clickSquare: jest.fn(),
  selectedSquare: undefined,
  legalMoves: new Map(),
  prevMove: null,
  playerColor: 'w' as Color,
  hint: null,
};

describe('Board Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('rendering the board', () => {
    it('should render the board', () => {
      render(<Board {...Props} />);
      expect(screen.queryAllByRole('button')).toHaveLength(64);
    });
    it('should color the square correctly', () => {
      render(<Board {...Props} />);
      const dark = within(screen.getByTestId('a1'));
      const light = within(screen.getByTestId('a2'));
      expect(light.getByTestId('square')).toHaveStyle({
        backgroundColor: '#EDD6B0',
      });
      expect(dark.getByTestId('square')).toHaveStyle({
        backgroundColor: '#B88762',
      });
    });
    it('should label the first square of each row/file', () => {
      render(<Board {...Props} />);
      const a1 = within(screen.getByTestId('a1'));
      const a2 = within(screen.getByTestId('a2'));
      const b1 = within(screen.getByTestId('b1'));
      expect(a1.getByText('a')).toBeOnTheScreen();
      expect(a1.getByText('1')).toBeOnTheScreen();
      expect(a2.getByText('2')).toBeOnTheScreen();
      expect(a2.queryByText('a')).toBe(null);
      expect(b1.getByText('b')).toBeOnTheScreen();
    });
    it('should put the peice image on squares with pieces', () => {
      render(<Board {...Props} />);
      const a2 = within(screen.getByTestId('a2'));
      const a3 = within(screen.getByTestId('a3'));
      expect(a2.getByTestId('pieceImage')).toBeOnTheScreen();
      expect(a3.queryByTestId('pieceImage')).toBe(null);
    });
    it('should start from the white perspective', () => {
      //the first square at the top of the screen should be
      //the a8 square
      render(<Board {...Props} />);
      expect(screen.getAllByRole('button')[0]).toHaveProp('id', 'a8');
    });
    it('should switch perspective if the player is black', () => {
      const otherProps = {...Props, playerColor: 'b' as Color};
      render(<Board {...otherProps} />);
      expect(screen.getAllByRole('button')[0]).toHaveProp('id', 'h1');
    });
    it('should not set the width if already set', () => { 
      const otherProps = {
        ...Props,
        prevMove: {to: 'b5' as Square, from: 'g6' as Square},
        playerColor: 'b' as Color
      };
      render(<Board {...otherProps} />);
      fireEvent(screen.getByTestId('a1'), 'layout', {
        nativeEvent: {layout: {height: 10, width: 10}},
      });
      expect(screen.getByTestId('path')).toHaveProp('d', 'M 15 55 L 65 45');
      fireEvent(screen.getByTestId('a1'), 'layout', {
        nativeEvent: {layout: {height: 50, width: 20}}
      });
      //should not change
      expect(screen.getByTestId('path')).toHaveProp('d', 'M 15 55 L 65 45');

     })
  });
  describe('functionality', () => {
    it('should not show the selected square', async () => {
      render(<Board {...Props} />);
      expect(screen.queryByTestId('selected')).toBe(null);
    });
    it('should show the selected square', () => {
      const otherProps = {...Props, selectedSquare: 'a1' as Square};
      render(<Board {...otherProps} />);
      expect(screen.getByTestId('selected')).toBeOnTheScreen();
      expect(screen.getAllByTestId('selected')).toHaveLength(1);
      expect(
        within(screen.getByTestId('a1')).getByTestId('selected')
      ).toBeTruthy();
    });
    it('should not show legal moves if there are none', () => {
      render(<Board {...Props} />);
      expect(screen.queryAllByTestId('legalMove')).toHaveLength(0);
    });
    it('should show legal move squares', () => {
      const otherProps = {
        ...Props,
        legalMoves: new Map<Square, Move>([
          ['a1', {from: 'a2'} as Move],
          ['a2', {from: 'b3'} as Move],
        ]),
      };
      render(<Board {...otherProps} />);
      expect(screen.getAllByTestId('legalMove')).toHaveLength(2);
      expect(
        within(screen.getByTestId('a1')).getByTestId('legalMove')
      ).toBeOnTheScreen();
      expect(
        within(screen.getByTestId('a2')).getByTestId('legalMove')
      ).toBeOnTheScreen();
      expect(within(screen.getByTestId('a3')).queryByTestId('legalMove')).toBe(
        null
      );
    });
    it('should show the hint square', () => {
      const otherProps = {...Props, hint: 'e4' as Square};
      render(<Board {...otherProps} />);
      expect(screen.getByTestId('selected')).toBeOnTheScreen();
      expect(
        within(screen.getByTestId('e4')).getByTestId('selected')
      ).toBeOnTheScreen();
    });
    it('should click on a square', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup();
      render(<Board {...Props} />);
      expect(Props.clickSquare).not.toHaveBeenCalled();

      await user.press(screen.getByTestId('e4'));
      expect(Props.clickSquare).toHaveBeenCalledWith('e4');
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });
    it('should not show a path if no prevMove', () => {
      render(<Board {...Props} />);
      expect(screen.queryByTestId('path')).toBe(null);
    });
    it('should show the path when there is prevMove', () => {
      const otherProps = {
        ...Props,
        prevMove: {to: 'a1' as Square, from: 'a2' as Square},
      };
      render(<Board {...otherProps} />);
      expect(screen.getByTestId('path')).toBeOnTheScreen();
    });
    it('should have the correct coordinates for svg', () => {
      const otherProps = {
        ...Props,
        prevMove: {to: 'b5' as Square, from: 'g6' as Square},
      };
      render(<Board {...otherProps} />);
      //width = 10, offset = 5
      //to: 1*10 + 5 = 15, 3*10 + 5 = 35
      //from: 6*10 +5 = 65, 2*10 +5  = 25
      //COORDIANTES: (65,25), (15,35) from white perspective
      fireEvent(screen.getByTestId('a1'), 'layout', {
        nativeEvent: {layout: {height: 10, width: 10}},
      });
      expect(screen.getByTestId('path')).toHaveProp('d', 'M 65 25 L 15 35');
    });
    it('should draw the line from black perspective', () => {
      const otherProps = {
        ...Props,
        prevMove: {to: 'b5' as Square, from: 'g6' as Square},
        playerColor: 'b' as Color
      };
      render(<Board {...otherProps} />);
      //width = 10, offset = 5
      //to: 6*10 + 5 = 65, 4*10 +5 = 45
      //from: 1*10 +5 = 15, 5*10+5 = 55
      //COORDIANTES: (15,55), (65,45) from black perspective
      fireEvent(screen.getByTestId('a1'), 'layout', {
        nativeEvent: {layout: {height: 10, width: 10}},
      });
      expect(screen.getByTestId('path')).toHaveProp('d', 'M 15 55 L 65 45');
    });
    it('should return 0s if the width is not set', () => { 
      const otherProps = {...Props, prevMove: {to: 'b5' as Square, from: 'g6' as Square}} 
        render(<Board {...otherProps} />);
        expect(screen.getByTestId('path')).toHaveProp('d', 'M 0 0 L 0 0')
     })
  });
  
});
