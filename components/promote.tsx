import {Color, Move, Piece, PieceSymbol, Square} from 'chess.js';
import {StyleSheet, View, Image, Pressable} from 'react-native';
import {chooseImage} from '../helpers/chooseImage';
import {Feather} from '@expo/vector-icons';

type Props = {
  color: Color;
  onPress: (
    from: Square,
    to: Square,
    promo: Omit<PieceSymbol, 'p' | 'k'>
  ) => void;
  move: Move;
  cancel: () => void;
};

const Promote = ({color, onPress, move, cancel}: Props) => (
  <View style={styles.container}>
    <Pressable
      accessibilityRole="button"
      style={styles.box}
      onPress={() => onPress(move.from, move.to, 'q')}
    >
      <Image style={styles.image} source={chooseImage('q', color)}></Image>
    </Pressable>
    <Pressable
      accessibilityRole="button"
      style={styles.box}
      onPress={() => onPress(move.from, move.to, 'r')}
    >
      <Image style={styles.image} source={chooseImage('r', color)}></Image>
    </Pressable>
    <Pressable
      accessibilityRole="button"
      style={styles.box}
      onPress={() => onPress(move.from, move.to, 'b')}
    >
      <Image style={styles.image} source={chooseImage('b', color)}></Image>
    </Pressable>
    <Pressable
      accessibilityRole="button"
      style={styles.box}
      onPress={() => onPress(move.from, move.to, 'n')}
    >
      <Image style={styles.image} source={chooseImage('n', color)}></Image>
    </Pressable>
    <Pressable accessibilityRole="button" style={styles.box} onPress={cancel}>
      <Feather name="x" size={60} color="black" />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: '#a2a3a2',
    borderColor: 'black',
    borderWidth: 2,
  },
  image: {
    width: 60,
    height: 60,
  },
});

export default Promote;
