import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import Panel from './Panel';
import useStore from '../core/store';

const PropertiesPanel = () => {
  const { selectedControl, controls, updateControlProperty } = useStore();

  // Find the actual control object
  const activeControl = controls.find(c => c.id === selectedControl);

  // Generate properties object based on selection
  const properties = activeControl 
    ? { 
        Name: activeControl.id, 
        Caption: activeControl.text, 
        Left: activeControl.x.toString(), 
        Top: activeControl.y.toString(),
        Width: activeControl.width.toString(),
        Height: activeControl.height.toString()
      }
    : { Name: 'Form1', Caption: 'Form1', BackColor: '&H8000000F&' };

  const handleChange = (key, text) => {
      if (activeControl) {
          updateControlProperty(activeControl.id, key, text);
      }
  };

  return (
    <Panel title={`Properties - ${selectedControl || 'Form1'}`} titleBarColor="#000080">
      <ScrollView style={styles.content}>
        {Object.entries(properties).map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{key}</Text>
            <TextInput 
                style={styles.value} 
                value={value} 
                editable={true}
                onChangeText={(text) => handleChange(key, text)} 
            />
          </View>
        ))}
      </ScrollView>
    </Panel>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#000080',
    padding: 2,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    flex: 1,
    padding: 2,
    backgroundColor: '#f0f0f0',
    borderRightWidth: 1,
    borderColor: '#ccc',
    fontSize: 11,
  },
  value: {
    flex: 1,
    padding: 2,
    fontSize: 11,
  }
});

export default PropertiesPanel;
