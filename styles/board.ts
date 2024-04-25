import { StyleSheet } from 'react-native';


const boardStyle = StyleSheet.create({
  board:{
    width:'100%',
    position: 'relative'

  },
  rank:{
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
  },
  square:{
    flex:1,
    aspectRatio: 1
  },
  lightSquare:{
    backgroundColor: '#EDD6B0',
    aspectRatio:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  darkSquare:{
    backgroundColor:'#B88762',
    aspectRatio:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedSquare:{
    position: 'absolute',
    left: 0,
    right:0,
    top:0,
    bottom:0,
    borderWidth:2,
    borderColor: 'red'
  },
  image:{
   height:'80%',
   width:'80%'
  },
  legalMoveSquare:{
    position: 'absolute',
    width:'15%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: 'green',
    zIndex:1
  },
  coordFile:{
    position: 'absolute',
    right: 2,
    bottom: 0
  },
  coordRank:{
    position: 'absolute',
    left: 2,
    top:2
  },
  promote:{
    position: 'absolute',
    margin: 'auto',
    zIndex: 3,
    backgroundColor: 'green',
    width: '100%'
  }
})


export default boardStyle