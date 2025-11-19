import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FormLayout = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Form Layout</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.monitor}>
            <View style={styles.formPreview}>
                <Text style={styles.previewText}>Form1</Text>
            </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  header: {
    backgroundColor: '#999',
    padding: 2,
  },
  headerText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  monitor: {
      width: 80,
      height: 60,
      borderWidth: 2,
      borderColor: '#666',
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
  },
  formPreview: {
      width: 40,
      height: 30,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#999',
      justifyContent: 'center',
      alignItems: 'center'
  },
  previewText: {
      fontSize: 6,
      color: '#000'
  }
});

export default FormLayout;
