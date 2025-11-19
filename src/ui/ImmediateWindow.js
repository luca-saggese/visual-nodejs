/**
 * Visual Node.js - Immediate Window
 * A REPL-like interface for debugging and executing code on the fly.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import Panel from './Panel';
import NodeBridge from '../bridge/node-bridge';
import NodeInspectorClient from '../debugger/node-inspector';

const ImmediateWindow = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(['Immediate Window ready.']);

  useEffect(() => {
    // Listen for output from the bridge (stdout/stderr)
    const handleOutput = (data) => {
        setOutput(prev => [...prev, data]);
    };
    
    NodeBridge.on('stdout', handleOutput);
    
    return () => {
        // Cleanup listener (if NodeBridge supported removeListener)
    };
  }, []);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    const command = input;
    setOutput(prev => [...prev, `> ${command}`]);
    
    // Try to use Inspector first if connected, else fall back to Bridge IPC
    if (NodeInspectorClient.isConnected) {
        try {
            const response = await NodeInspectorClient.evaluate(command);
            // response.result is { type: 'string', value: '...' }
            const resultValue = response.result.value !== undefined ? String(response.result.value) : response.result.description;
            setOutput(prev => [...prev, resultValue]);
        } catch (err) {
            setOutput(prev => [...prev, `Error: ${err.message}`]);
        }
    } else {
        // Fallback to IPC
        NodeBridge.sendCommand(command);
        // IPC response is handled via 'stdout' event usually, or we need to wire up a specific listener for eval results
    }
    
    setInput('');
  };

  return (
    <Panel title="Immediate" titleBarColor="#000080">
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
    </Panel>
  );
};

const styles = StyleSheet.create({
  outputArea: {
    flex: 1,
    padding: 5,
    backgroundColor: 'white',
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
    backgroundColor: 'white',
  },
  input: {
    height: 24,
    fontSize: 11,
    fontFamily: 'Menlo',
    padding: 4,
  }
});

export default ImmediateWindow;
