import { StyleSheet } from 'react-native';


const captureStyle = StyleSheet.create({
  captureContainer: {
    backgroundColor: 'grey',
    width:'100%',
    height: 47,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  capturePiece:{
    alignItems: 'center',
    justifyContent: 'center',
    width:'9%',
    aspectRatio: 1,
    marginRight: -2,
  },
  pawn:{
    marginLeft: -8,
    marginRight:-8,
    marginBottom: -5,
  },
  image:{
    width:'100%',
    height: '100%',
  }
})

export default captureStyle;
