import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusBar = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.section, styles.main]}>
        <Text style={styles.text}>Ready</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>Ln 1, Col 1</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>INS</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 22,
    backgroundColor: '#E0E0E0',
    borderTopWidth: 1,
    borderColor: '#808080',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  section: {
    borderWidth: 1,
    borderColor: '#808080',
    borderBottomColor: '#FFFFFF',
    borderRightColor: '#FFFFFF',
    paddingHorizontal: 5,
    height: 18,
    justifyContent: 'center',
    marginRight: 2,
    minWidth: 50,
  },
  main: {
      flex: 1,
  },
  text: {
      fontSize: 11,
      color: 'black',
  }
});

export default StatusBar;
