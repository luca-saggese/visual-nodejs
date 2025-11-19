import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import NodeBridge from '../bridge/node-bridge';
import useStore from '../core/store';
import Compiler from '../compiler/ide-compiler';

const Toolbar = () => {
  const { fileContents } = useStore();

  const handleRun = () => {
      // 1. Compile/Build
      const buildPath = Compiler.buildRun(fileContents);
      
      // 2. Run via Bridge
      NodeBridge.runProject(buildPath);
  };

  return (
    <View style={styles.toolbar}>
      <TouchableOpacity style={styles.button} onPress={handleRun}>
        <Text>▶ Run</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text>⏸ Pause</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => NodeBridge.stopProject()}>
        <Text>⏹ Stop</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={styles.button}>
        <Text>Add Form</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderColor: '#808080',
    paddingHorizontal: 5,
  },
  button: {
    padding: 5,
    marginRight: 5,
    backgroundColor: '#D0D0D0',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderBottomColor: '#808080',
    borderRightColor: '#808080',
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: '#808080',
    marginHorizontal: 5,
  }
});

export default Toolbar;
