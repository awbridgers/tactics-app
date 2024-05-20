import Controls from '../../components/controls';
import {render, screen, userEvent} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import {act} from 'react-test-renderer';

const props = {
  tacticActive: true,
  viewSolution: jest.fn(),
  showingSolution: false,
  next: jest.fn(),
  analysis: jest.fn(),
  retry: jest.fn(),
  hint: jest.fn(),
  active: true,
};

describe('controls component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('rendering', () => {
    it('should render the hint / solution buttons if active and not showing solution', () => {
      render(<Controls {...props} />);
      expect(screen.getByText('View Solution')).toBeOnTheScreen();
      expect(screen.getByText('Show Hint')).toBeOnTheScreen();
    });
    it('should show nothing if the solution is being shown', () => {
      const otherProps = {...props, showingSolution: true, tacticActive: false};
      render(<Controls {...otherProps} />);
      expect(screen.getByTestId('empty')).toBeOnTheScreen();
    });
    it('should show the retry/next/analyze buttons at the end', () => {
      const otherProps = {...props, tacticActive: false};
      render(<Controls {...otherProps} />);
      expect(screen.getByText('Retry')).toBeOnTheScreen();
      expect(screen.getByText('Analysis')).toBeOnTheScreen();
      expect(screen.getByText('Next')).toBeOnTheScreen();
    });
  });
  describe('functionality', () => {
    it('should press the end of game buttons', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup();
      const otherProps = {...props, tacticActive: false};
      render(<Controls {...otherProps} />);
      const retry = screen.getByRole('button', {name: 'Retry'});
      const analysis = screen.getByRole('button', {name: 'Analysis'});
      const next = screen.getByRole('button', {name: 'Next'});
      await user.press(retry);
      expect(props.retry).toHaveBeenCalledTimes(1);
      await user.press(analysis);
      expect(props.analysis).toHaveBeenCalledTimes(1);
      await user.press(next);
      expect(props.next).toHaveBeenCalledTimes(1);
      act(() => {
        jest.runOnlyPendingTimers();
      });
      jest.useRealTimers();
    });
    it('should press the active buttons',  async() => {
      jest.useFakeTimers();
      const user = userEvent.setup();
      render(<Controls {...props} />);
      const hint = screen.getByRole('button', {name: 'Show Hint'});
      const solution = screen.getByRole('button', {name: 'View Solution'});
      await user.press(hint);
      expect(props.hint).toHaveBeenCalledTimes(1);
      await user.press(solution);
      expect(props.viewSolution).toHaveBeenCalledTimes(1);
      act(() => {
        jest.runOnlyPendingTimers();
      });
      jest.useRealTimers();
    });
    it('should do nothing if buttons are not active', async() => { 
      jest.useFakeTimers();
      const user = userEvent.setup();
      const otherProps = {...props, active: false}
      render(<Controls {...otherProps} />);
      await user.press(screen.getByRole('button', {name: 'Show Hint'}));
      expect(props.hint).not.toHaveBeenCalled();
      act(() => {
        jest.runOnlyPendingTimers();
      });
      jest.useRealTimers();


     })
  });
});
