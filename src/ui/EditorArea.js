import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Panel from './Panel';
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
    <Panel title={`${activeFile} (${editorMode === 'design' ? 'Form' : 'Code'})`} titleBarColor="#000080">
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
    </Panel>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
  },
  tab: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#808080',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  codeNavBar: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#808080',
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
  },
  dropdownText: {
    fontSize: 12,
    marginRight: 4,
  },
  dropdownArrow: {
    fontSize: 10,
  },
  canvas: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default EditorArea;

