import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Panel from './Panel';
import useStore from '../core/store';

const ProjectExplorer = () => {
  const { files, setActiveFile } = useStore();

  return (
    <Panel title="Project Explorer" titleBarColor="#000080">
      <ScrollView style={styles.content}>
        <Text style={styles.projectNode}>Project1 (vbp)</Text>
        <View style={{ paddingLeft: 10 }}>
          <Text style={styles.folderNode}>Forms</Text>
          <View style={{ paddingLeft: 10 }}>
            {files.filter(f => f.endsWith('.js') || f.endsWith('.layout.json')).map((file, index) => (
                <Text key={index} style={styles.fileNode} onPress={() => setActiveFile(file)}>
                    {file}
                </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </Panel>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 5,
  },
  projectNode: {
      fontWeight: 'bold',
      marginBottom: 2,
  },
  folderNode: {
      marginBottom: 2,
  },
  fileNode: {
      color: 'black',
      marginBottom: 2,
  }
});

export default ProjectExplorer;
