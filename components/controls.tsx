import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Pressable} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';

interface iProps {
  tacticActive: boolean;
  showingSolution: boolean;
  viewSolution: () => void;
  next: () => void;
  analysis: () => void;
  retry: () => void;
  hint: () => void;
  active: boolean;
}

const Controls = ({
  tacticActive,
  viewSolution,
  showingSolution,
  next,
  analysis,
  retry,
  hint,
  active,
}: iProps) =>
  tacticActive ? (
    <View>
      <Pressable
        style={({pressed})=>[controlStyle.viewSolution, {opacity: pressed ? 0.5: 1}]}
        accessibilityRole="button"
        disabled={!active}
        onPress={hint}
        testID="showHint"
      >
        <Text style={{fontSize: 24, color: '#B3b3b3'}}>Show Hint</Text>
      </Pressable>
      <Pressable
        style={({pressed})=>[controlStyle.viewSolution, {opacity: pressed ? 0.5: 1}]}
        accessibilityRole="button"
        disabled={!active}
        onPress={viewSolution}
        testID="showSolution"
      >
        <Text style={{fontSize: 24, color: '#B3b3b3'}}>View Solution</Text>
      </Pressable>
    </View>
  ) : !showingSolution ? (
    <View style={controlStyle.end}>
      <TouchableOpacity
        accessibilityRole="button"
        style={controlStyle.endButton}
        onPress={retry}
        testID="retry"
      >
        <FontAwesome5 name="backward" size={35} style={controlStyle.redo} />
        <Text style={{fontSize: 20, color: '#B3b3b3'}}>Retry</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        style={controlStyle.endButton}
        onPress={analysis}
      >
        <FontAwesome5 name="search" size={35} style={controlStyle.redo} />
        <Text style={{fontSize: 20, color: '#B3b3b3'}}>Analysis</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        style={controlStyle.endButton}
        onPress={next}
      >
        <FontAwesome5 name="forward" size={35} style={controlStyle.redo} />
        <Text style={{fontSize: 24, color: '#B3b3b3'}}>Next</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View testID="empty"></View>
  );

export default Controls;

const controlStyle = StyleSheet.create({
  viewSolution: {
    padding: 10,
    margin: 5,
    backgroundColor: '#404040',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#505050',
    alignSelf: 'center',
    alignItems: 'center',
    width: 200,
  },
  end: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  endButton: {
    padding: 10,
    margin: 10,
    backgroundColor: '#404040',
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#505050',
    alignSelf: 'center',
    alignItems: 'center',
    height: '75%',
    justifyContent: 'center',
    flex: 1,
  },
  redo: {
    color: '#b3b3b3',
  },
});
