import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MonacoWrapper from '../editors/monaco-wrapper';
import FormDesigner from '../editors/form-designer';
import useStore from '../core/store';

const EditorArea = () => {
  const { editorMode, setEditorMode, activeFile, fileContents, updateFileContent, controls, addEventHandler } = useStore();

  const currentCode = fileContents[activeFile] || '';

  // Mock Data for Dropdowns
  const objects = ['(General)', 'Form', ...controls.map(c => c.id)];
  const events = ['Click', 'Load', 'Resize', 'Unload', 'Change'];

  return (
    <View style={styles.container}>
      <View style={styles.windowHeader}>
        <Text style={styles.windowTitle}>{activeFile} ({editorMode === 'design' ? 'Form' : 'Code'})</Text>
      </View>
      
      {/* View Switcher Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setEditorMode('design')} style={[styles.tab, editorMode === 'design' && styles.activeTab]}>
            <Text>Object</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEditorMode('code')} style={[styles.tab, editorMode === 'code' && styles.activeTab]}>
            <Text>Code</Text>
        </TouchableOpacity>
      </View>

      {/* Code Navigation Bar (VB6 Style) */}
      {editorMode === 'code' && (
        <View style={styles.codeNavBar}>
           <View style={styles.dropdown}>
             <Text style={styles.dropdownText}>Form</Text> 
             <Text style={styles.dropdownArrow}>▼</Text>
           </View>
           <View style={styles.dropdown}>
             <Text style={styles.dropdownText}>Load</Text>
             <Text style={styles.dropdownArrow}>▼</Text>
           </View>
        </View>
      )}

      <View style={styles.canvas}>
        {editorMode === 'code' ? (
            <MonacoWrapper 
                code={currentCode} 
                language="javascript" 
                onChange={(newCode) => updateFileContent(activeFile, newCode)}
            />
        ) : (
            <FormDesigner />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#808080', // MDI background
    padding: 10,
  },
  windowHeader: {
    backgroundColor: '#000080',
    padding: 4,
  },
  windowTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  tabs: {
      flexDirection: 'row',
      backgroundColor: '#e0e0e0',
  },
  tab: {
      padding: 5,
      borderRightWidth: 1,
      borderColor: '#999',
  },
  activeTab: {
      backgroundColor: '#fff',
  },
  codeNavBar: {
      flexDirection: 'row',
      backgroundColor: '#e0e0e0',
      padding: 2,
      borderBottomWidth: 1,
      borderColor: '#999',
  },
  dropdown: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#999',
      marginRight: 2,
      paddingHorizontal: 4,
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 22,
  },
  dropdownText: {
      fontSize: 11,
  },
  dropdownArrow: {
      fontSize: 10,
      color: '#666',
  },
  canvas: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default EditorArea;
