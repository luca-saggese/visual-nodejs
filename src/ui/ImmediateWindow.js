/**
 * Visual Node.js - Immediate Window
 * A REPL-like interface for debugging and executing code on the fly.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import NodeBridge from '../bridge/node-bridge';

const ImmediateWindow = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(['Immediate Window ready.']);

  useEffect(() => {
    // Listen for output from the bridge
    const handleOutput = (data) => {
        setOutput(prev => [...prev, data]);
    };
    
    NodeBridge.on('stdout', handleOutput);
    
    // Cleanup not implemented in this simple mock bridge, but would be needed
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    
    const command = input;
    // setOutput(prev => [...prev, `> ${command}`]); // Bridge echoes this usually
    
    // Send to bridge
    NodeBridge.sendCommand(command);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Immediate</Text>
      </View>
      <ScrollView style={styles.outputArea}>
        {output.map((line, i) => (
          <Text key={i} style={styles.outputText}>{line}</Text>
        ))}
      </ScrollView>
      <View style={styles.inputArea}>
        <TextInput 
            style={styles.input} 
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSubmit}
            placeholder="Type code here..."
            placeholderTextColor="#999"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    borderTopWidth: 1,
    borderColor: '#808080',
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#999', // Inactive title bar usually, or active if focused
    padding: 2,
  },
  headerText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  outputArea: {
    flex: 1,
    padding: 5,
  },
  outputText: {
    fontFamily: 'Menlo',
    fontSize: 11,
    color: '#333',
  },
  inputArea: {
    borderTopWidth: 1,
    borderColor: '#eee',
    padding: 2,
  },
  input: {
    height: 24,
    fontSize: 11,
    fontFamily: 'Menlo',
    padding: 4,
  }
});

export default ImmediateWindow;
