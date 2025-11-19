import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Shell from './Shell';

const App = () => {
  return (
    <Shell />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default App;
