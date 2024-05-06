import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';


interface iProps {
  tacticActive: boolean;
  showingSolution: boolean;
  viewSolution: () => void;
  next: () => void;
  analysis: ()=>void;
  retry: ()=>void;
}

const Controls = ({
  tacticActive,
  viewSolution,
  showingSolution,
  next,
  analysis,
  retry
}:iProps) => (
      tacticActive ? (<View>
        <TouchableOpacity
          style={controlStyle.viewSolution}
          onPress={viewSolution}
          testID = 'showSolution'
        >
          <Text style={{fontSize: 24, color: '#B3b3b3'}}>View Solution</Text>
        </TouchableOpacity>
      </View>): !showingSolution ?
      (<View style={controlStyle.end}>
        <TouchableOpacity style={controlStyle.endButton} onPress={retry} testID = 'retry'>
          <FontAwesome5 name="backward" size={35} style={controlStyle.redo} />
          <Text style={{fontSize: 20, color: '#B3b3b3'}}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={controlStyle.endButton} onPress = {analysis}>
          <FontAwesome5 name="search" size={35} style={controlStyle.redo} />
          <Text style={{fontSize: 20, color: '#B3b3b3'}}>Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={controlStyle.endButton} onPress={next}>
          <FontAwesome5 name="forward" size={35} style={controlStyle.redo} />
          <Text style={{fontSize: 24, color: '#B3b3b3'}}>Next</Text>
        </TouchableOpacity>
      </View>):
      <View></View>
    );

export default Controls;

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