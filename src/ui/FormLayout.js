import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Panel from './Panel';

const FormLayout = () => {
  return (
    <Panel title="Form Layout" titleBarColor="#808080" style={styles.panel}>
      <View style={styles.content}>
        <View style={styles.monitor}>
            <View style={styles.formPreview}>
                <Text style={styles.previewText}>Form1</Text>
            </View>
        </View>
      </View>
    </Panel>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#E0E0E0',
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
