import { StyleSheet } from 'react-native';


const controlStyle = StyleSheet.create({
  viewSolution: {
    padding: 10,
    backgroundColor: '#404040',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#505050',
    alignSelf: 'center',
    alignItems: 'center'
  },
  end: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around', 

  },
  endButton:{
    padding: 10,
    margin:10,
    backgroundColor: '#404040',
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#505050',
    alignSelf: 'center',
    alignItems: 'center',
    height: '75%',
    justifyContent: 'center',
    flex:1,
  },
  redo:{
    color: '#b3b3b3',
  }
})



export default controlStyle;