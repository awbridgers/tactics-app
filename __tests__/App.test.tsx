import App from '../App';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react-native';
import {PGNFormat} from '../types/PGN';
import * as ScreenOrientation from 'expo-screen-orientation';
import '@testing-library/jest-native/extend-expect';
import {act} from 'react-test-renderer';
import {Chess} from 'chess.js';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import * as Linking from 'expo-linking'

const fakeTacticBlack: PGNFormat = {
  fen: '6k1/5p1p/6p1/8/2pPRqP1/P1P1RBNP/5P1K/r5r1 b - - 0 1',
  pgn: [
    {
      move: 'Rh1+',
      move_number: 1,
    },
    {
      move: 'Bxh1',
      move_number: 2,
    },
    {
      move: 'Qxf2+',
    },
    {
      move: 'Bg2',
      move_number: 3,
    },
    {
      move: 'Qg1#',
    },
  ],
};
const fakeTacticWhite = {
  fen: '2r4k/3r1p1p/1p2pP2/p2pPp1P/P2P1Q2/6R1/4B1PK/2q5 w - - 0 1',
  pgn: [{move_number: 1, move: 'Rg8+'}],
};
const fakeTacticPromo = {
  fen: '8/1p2Pkp1/2pn1p1p/8/3P2PN/8/2q2PPK/4Q3 w - - 0 1',
  pgn: [
    {move_number: 1, move: 'e8=Q+', comments: []},
    {move: 'Nxe8', comments: []},
    {move_number: 2, move: 'Nf5', comments: []},
  ],
};

jest.mock('../tactics', () => ({
  tactics: [fakeTacticBlack, fakeTacticWhite, fakeTacticPromo],
}));
jest.mock('expo-status-bar');

describe('app Component', () => {
  beforeEach(() => {
    //control which tactic is loaded
    jest.spyOn(Math, 'floor').mockReturnValue(0);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('start up', () => {
    it('should render', () => {
      render(<App />);
      expect(screen.getByTestId('app')).toBeOnTheScreen();
    });
    it('should load a tactic', () => {
      const load = jest.spyOn(Chess.prototype, 'loadPgn');
      const random = jest.spyOn(Math, 'random');
      render(<App />);
      expect(random).toBeCalledTimes(1);
      expect(load).toBeCalledTimes(1);
    });
    it('should keep the board for white perspective', () => {
      jest.spyOn(Math, 'floor').mockReturnValue(1);
      render(<App />);
      expect(screen.getAllByRole('button')[0]).toHaveProp('id', 'a8');
    });
    it('should flip the board for black', () => {
      render(<App />);
      expect(screen.getAllByRole('button')[0]).toHaveProp('id', 'h1');
    });
  });
  describe('functionality', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });
    describe('clicking the board', () => {
      it('should click on a square with a piece on it', async () => {
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        //the important squares
        const g8 = screen.getByTestId('g8');
        const g7 = screen.getByTestId('g7');
        const h8 = screen.getByTestId('h8');
        const f8 = screen.getByTestId('f8');
        await user.press(g8);
        //the legal move squares should appear
        expect(screen.getAllByTestId('legalMove')).toHaveLength(3);
        for (const square of [g7, h8, f8]) {
          expect(within(square).getByTestId('legalMove')).toBeOnTheScreen();
        }
      });
      it('should do nothing if clicked square has no piece', async () => {
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        await user.press(screen.getByTestId('f8'));
        expect(screen.queryAllByTestId('legalMove')).toHaveLength(0);
      });
      it('should do nothing it you click an opponents piece', async () => {
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        const a3 = screen.getByTestId('a3');
        await user.press(a3);
        expect(screen.queryAllByTestId('legalMove')).toHaveLength(0);
      });
      it('should move the piece when clicked again on a legal move square', async () => {
        const spy = jest.spyOn(Chess.prototype, 'move');
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);

        //the important squares
        const g8 = screen.getByTestId('g8');
        await user.press(g8);
        await user.press(screen.getByTestId('f8'));
        expect(spy).toBeCalledWith({to: 'f8', from: 'g8', promotion: 'q'});
        act(() => {
          jest.runOnlyPendingTimers();
        });
      });
      it('should cancel legal move squares/selected when a non legal square is clicked', async () => {
        const spy = jest.spyOn(Chess.prototype, 'move');
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        const g8 = screen.getByTestId('g8');
        await user.press(g8);
        await user.press(screen.getByTestId('a2'));
        expect(screen.queryAllByTestId('legalMove')).toHaveLength(0);
        expect(screen.queryByTestId('selected')).toBe(null);
      });
      it('should cancel legal move squares/selected when re-clicked', async () => {
        const spy = jest.spyOn(Chess.prototype, 'move');
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        const g8 = screen.getByTestId('g8');
        await user.press(g8);
        await user.press(screen.getByTestId('g8'));
        expect(screen.queryAllByTestId('legalMove')).toHaveLength(0);
        expect(screen.queryByTestId('selected')).toBe(null);
      });
      it('should switch pieces if clicked on another piece', async () => {
        const spy = jest.spyOn(Chess.prototype, 'move');
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        const g8 = screen.getByTestId('g8');
        await user.press(g8);
        await user.press(screen.getByTestId('a1'));
        expect(
          within(screen.getByTestId('a1')).getByTestId('selected')
        ).toBeOnTheScreen();
      });
      it('should do nothing on press if tactic is not active', async () => {
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        //fast foward to the end of the solution
        const solution = screen.getByRole('button', {name: 'View Solution'});
        await user.press(solution);
        act(() => jest.runAllTimers());
        //tacticActive should now be false
        const g8 = screen.getByTestId('g8');
        await user.press(g8);
        expect(screen.queryByTestId('selected')).toBe(null);
      });
    });
    describe('making a promotion', () => {
      beforeEach(() => {
        jest.spyOn(Math, 'floor').mockReturnValue(2);
      });
      it('should pull up the promotion modal', async () => {
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        await user.press(screen.getByTestId('e7'));
        await user.press(screen.getByTestId('e8'));
        expect(screen.getByTestId('promotion')).toHaveProp('visible', true);
      });
      it('promote with queen', async () => {
        const move = jest.spyOn(Chess.prototype, 'move');
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        await user.press(screen.getByTestId('e7'));
        await user.press(screen.getByTestId('e8'));
        const promo = screen.getByTestId('promotion');
        const buttons = within(promo).getAllByRole('button');
        await user.press(buttons[0]);
        expect(move).toHaveBeenCalledWith({
          from: 'e7',
          to: 'e8',
          promotion: 'q',
        });
        act(() => jest.runOnlyPendingTimers());
      });
      it('promote with rook', async () => {
        const move = jest.spyOn(Chess.prototype, 'move');
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        await user.press(screen.getByTestId('e7'));
        await user.press(screen.getByTestId('e8'));
        const promo = screen.getByTestId('promotion');
        const buttons = within(promo).getAllByRole('button');
        await user.press(buttons[1]);
        expect(move).toHaveBeenCalledWith({
          from: 'e7',
          to: 'e8',
          promotion: 'r',
        });
        act(() => jest.runOnlyPendingTimers());
      });
      it('promote with bishop', async () => {
        const move = jest.spyOn(Chess.prototype, 'move');
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        await user.press(screen.getByTestId('e7'));
        await user.press(screen.getByTestId('e8'));
        const promo = screen.getByTestId('promotion');
        const buttons = within(promo).getAllByRole('button');
        await user.press(buttons[2]);
        expect(move).toHaveBeenCalledWith({
          from: 'e7',
          to: 'e8',
          promotion: 'b',
        });
        act(() => jest.runOnlyPendingTimers());
      });
      it('promote with knight', async () => {
        const move = jest.spyOn(Chess.prototype, 'move');
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        await user.press(screen.getByTestId('e7'));
        await user.press(screen.getByTestId('e8'));
        const promo = screen.getByTestId('promotion');
        const buttons = within(promo).getAllByRole('button');
        await user.press(buttons[3]);
        expect(move).toHaveBeenCalledWith({
          from: 'e7',
          to: 'e8',
          promotion: 'n',
        });
        act(() => jest.runOnlyPendingTimers());
      });
      it('cancel promotion', async () => {
        const move = jest.spyOn(Chess.prototype, 'move');
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        await user.press(screen.getByTestId('e7'));
        await user.press(screen.getByTestId('e8'));
        const promo = screen.getByTestId('promotion');
        const buttons = within(promo).getAllByRole('button');
        await user.press(buttons[4]);
        expect(move).toBeCalledTimes(0);
        expect(screen.queryByTestId('selected')).toBe(null);
      });
    });
    describe('showing a hint', () => {
      it('should show a hint square on the first press', async () => {
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        await user.press(screen.getByRole('button', {name: 'Show Hint'}));
        expect(screen.getByTestId('selected')).toBeOnTheScreen();
      });
      it('should move the piece on second click on hint square', async () => {
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        const move = jest.spyOn(Chess.prototype, 'move');
        render(<App />);
        await user.press(screen.getByRole('button', {name: 'Show Hint'}));
        await user.press(screen.getByRole('button', {name: 'Show Hint'}));
        expect(move).toBeCalledWith('Rh1+');
        act(() => jest.runOnlyPendingTimers());
      });
      it('should run the computer move after moving', async () => {
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        const move = jest.spyOn(Chess.prototype, 'move');
        render(<App />);
        await user.press(screen.getByRole('button', {name: 'Show Hint'}));
        await user.press(screen.getByRole('button', {name: 'Show Hint'}));
        await waitFor(() => {
          expect(move).toHaveBeenCalledTimes(2);
        });
        act(() => jest.advanceTimersByTime(1000));
      });
      it('should not run the computer if that was the last move', async () => {
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        const move = jest.spyOn(Chess.prototype, 'move');
        const load = jest.spyOn(Chess.prototype, 'loadPgn');
        jest.spyOn(Math, 'floor').mockReturnValue(1);
        render(<App />);
        await user.press(screen.getByRole('button', {name: 'Show Hint'}));
        await user.press(screen.getByRole('button', {name: 'Show Hint'}));
        expect(move).toBeCalledTimes(1);
        expect(screen.getByText('Analysis')).toBeOnTheScreen();
      });
    });
    describe('checking the move', () => {
      it('should tell you the move is right', async () => {
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        await user.press(screen.getByTestId('g1'));
        await user.press(screen.getByTestId('h1'));
        await waitFor(() => {
          expect(screen.getByText('Great Job!')).toBeOnTheScreen();
        });
        act(() => jest.runOnlyPendingTimers());
      });
      it('should tell you the move is wrong', async () => {
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        await user.press(screen.getByTestId('g1'));
        await user.press(screen.getByTestId('g2'));
        await waitFor(() => {
          expect(screen.getByText('Incorrect, keep trying!')).toBeOnTheScreen();
        });
      });
      it('should bring up the control buttons if the was the last move', async () => {
        jest.spyOn(Math, 'floor').mockReturnValue(1);
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        await user.press(screen.getByTestId('g3'));
        await user.press(screen.getByTestId('g8'));
        await waitFor(() => {
          expect(screen.getByText('Next')).toBeOnTheScreen();
        });
      });
    });
    describe('retry', () => { 
      it('should restart the tactic on retry', async () => { 
        jest.spyOn(Math, 'floor').mockReturnValue(1);
        const load = jest.spyOn(Chess.prototype, 'load')
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        await user.press(screen.getByTestId('g3'));
        await user.press(screen.getByTestId('g8'));
        const button = await screen.findByText('Retry')
        await user.press(button);
        expect(within(screen.getByTestId('g3')).getByTestId('pieceImage')).toBeOnTheScreen();
       })
     })
    describe('anaylsis button', () => { 
      it('should open the analysis', async () => { 
        jest.spyOn(Math, 'floor').mockReturnValue(1);
        const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true)
        const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
        render(<App />);
        await user.press(screen.getByTestId('g3'));
        await user.press(screen.getByTestId('g8'));
        const button = await screen.findByText('Analysis')
        await user.press(button);
        expect(open).toBeCalledWith('https://lichess.org/analysis/2r4k/3r1p1p/1p2pP2/p2pPp1P/P2P1Q2/6R1/4B1PK/2q5 w - - 0 1')
        act(()=>jest.runAllTimers())
       })
     })
  });
});
