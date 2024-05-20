import {render, screen, userEvent} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import Promote from '../../components/promote';
import {chooseImage} from '../../helpers/chooseImage';
import {Color, Move, Square} from 'chess.js';
import {Image} from 'react-native';

jest.mock('../../helpers/chooseImage');


const props = {
  color: 'w' as Color,
  onPress: jest.fn(),
  move: {from: 'a1' as Square, to: 'a2' as Square} as Move,
  cancel: jest.fn(),
};

describe('Promote component', () => {
  describe('render', () => {
    it('should render', () => {
      render(<Promote {...props} />);
      expect(screen.getAllByRole('button')).toHaveLength(5);
    });
  });
  describe('functionality',()=>{
    it('should promote with queen', async () => { 
      jest.useFakeTimers();
      const user = userEvent.setup();
      render(<Promote {...props}/>);
      const buttons = screen.getAllByRole('button');
      await user.press(buttons[0]);
      expect(props.onPress).toHaveBeenCalledWith('a1', 'a2', 'q')
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
     })
     it('should promote with rook', async () => { 
      jest.useFakeTimers();
      const user = userEvent.setup();
      render(<Promote {...props}/>);
      const buttons = screen.getAllByRole('button');
      await user.press(buttons[1]);
      expect(props.onPress).toHaveBeenCalledWith('a1', 'a2', 'r')
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
     })
     it('should promote with bishop', async () => { 
      jest.useFakeTimers();
      const user = userEvent.setup();
      render(<Promote {...props}/>);
      const buttons = screen.getAllByRole('button');
      await user.press(buttons[2]);
      expect(props.onPress).toHaveBeenCalledWith('a1', 'a2', 'b')
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
     })
     it('should promote with knight', async () => { 
      jest.useFakeTimers();
      const user = userEvent.setup();
      render(<Promote {...props}/>);
      const buttons = screen.getAllByRole('button');
      await user.press(buttons[3]);
      expect(props.onPress).toHaveBeenCalledWith('a1', 'a2', 'n')
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
     })
     it('should cancel', async () => { 
      jest.useFakeTimers();
      const user = userEvent.setup();
      render(<Promote {...props}/>);
      const buttons = screen.getAllByRole('button');
      await user.press(buttons[4]);
      expect(props.cancel).toHaveBeenCalled();
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
     })
  })
});
