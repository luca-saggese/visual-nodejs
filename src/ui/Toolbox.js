import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Panel from './Panel';
import useStore from '../core/store';

const Toolbox = () => {
  const { selectedTool, setSelectedTool } = useStore();
  const tools = ['Pointer', 'Label', 'Button', 'TextBox', 'Frame', 'CheckBox', 'ComboBox'];

  return (
    <Panel title="Toolbox" titleBarColor="#808080" style={styles.panel}>
      <ScrollView style={styles.container}>
      {tools.map((tool, index) => (
        <TouchableOpacity 
            key={index} 
            style={[styles.toolItem, selectedTool === tool && styles.selectedTool]}
            onPress={() => setSelectedTool(tool)}
        >
          {/* Placeholder for Icon */}
          <View style={styles.iconPlaceholder} />
          {/* Optional: Show text for prototype clarity */}
          {/* <Text style={{fontSize: 8}}>{tool}</Text> */}
        </TouchableOpacity>
      ))}
      </ScrollView>
    </Panel>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#E0E0E0',
  },
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: '#E0E0E0',
  },
  toolItem: {
    width: 40,
    height: 40,
    marginBottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D0D0D0',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderBottomColor: '#808080',
    borderRightColor: '#808080',
  },
  selectedTool: {
      backgroundColor: '#E0E0E0',
      borderColor: '#808080',
      borderWidth: 1,
      borderBottomColor: '#FFFFFF',
      borderRightColor: '#FFFFFF',
      // Inset effect
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: '#999',
  }
});

export default Toolbox;
