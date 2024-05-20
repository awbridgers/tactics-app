import App from '../App';
import {render, screen, waitFor} from '@testing-library/react-native';
import {Chess} from 'chess.js';
import {PGNFormat} from '../types/PGN';
import { tactics } from '../tactics';
import { hideAsync } from 'expo-splash-screen';

const fakeTactic: PGNFormat = {
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
const mockLoad = jest.fn();


jest.mock('../tactics',()=>({
  tactics: [fakeTactic]
}))


describe('App', () => {
  it.only('should render the app', () => {
    render(<App />);
    expect(screen.getByTestId('app')).toBeTruthy();
  });
  
});
