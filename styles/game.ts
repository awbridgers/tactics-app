import {StyleSheet} from 'react-native';

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
    fontSize:20,
    textAlign: 'center'
  },
  correct:{
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    fontSize:20,
    textAlign: 'center'
  }
});

export default gameStyle;
