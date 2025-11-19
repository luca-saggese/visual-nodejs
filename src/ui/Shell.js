import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Menu from './Menu';
import Toolbar from './Toolbar';
import Toolbox from './Toolbox';
import ProjectExplorer from './ProjectExplorer';
import PropertiesPanel from './PropertiesPanel';
import FormLayout from './FormLayout';
import EditorArea from './EditorArea';
import ImmediateWindow from './ImmediateWindow';
import StatusBar from './StatusBar';
import useStore from '../core/store';

const Shell = () => {
  const { initProject } = useStore();

  useEffect(() => {
      // Initialize a default project on startup for the prototype
      initProject();
  }, [initProject]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Menu Bar */}
        <View style={styles.menuBar}>
          <Menu />
        </View>
        
        {/* Toolbar */}
        <View style={styles.toolbarBar}>
          <Toolbar />
        </View>
        
        {/* Main Content Area */}
        <View style={styles.mainContent}>
          {/* Left Panel - Toolbox */}
          <View style={styles.leftPanel}>
            <Toolbox />
          </View>

          {/* Center Panel - Editor + Immediate Window */}
          <View style={styles.centerPanel}>
            <View style={styles.editorArea}>
              <EditorArea />
            </View>
            <View style={styles.immediateWindow}>
              <ImmediateWindow />
            </View>
          </View>

          {/* Right Panel - Project Explorer + Properties + Form Layout */}
          <View style={styles.rightPanel}>
            <View style={styles.projectExplorer}>
              <ProjectExplorer />
            </View>
            <View style={styles.propertiesPanel}>
              <PropertiesPanel />
            </View>
            <View style={styles.formLayout}>
              <FormLayout />
            </View>
          </View>
        </View>

        {/* Status Bar */}
        <View style={styles.statusBarContainer}>
          <StatusBar />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#C0C0C0',
  },
  menuBar: {
    height: 24,
    backgroundColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
  },
  toolbarBar: {
    height: 36,
    backgroundColor: '#D0D0D0',
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  // Left Panel - Toolbox
  leftPanel: {
    width: 80,
    backgroundColor: '#E0E0E0',
    borderRightWidth: 1,
    borderRightColor: '#808080',
  },
  // Center Panel
  centerPanel: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  editorArea: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#808080',
    margin: 2,
  },
  immediateWindow: {
    height: 150,
    borderWidth: 1,
    borderColor: '#808080',
    margin: 2,
  },
  // Right Panel
  rightPanel: {
    width: 250,
    overflow: 'hidden',
    flexDirection: 'column',
    backgroundColor: '#E0E0E0',
    borderLeftWidth: 1,
    borderLeftColor: '#808080',
  },
  projectExplorer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
  },
  propertiesPanel: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
  },
  formLayout: {
    height: 150,
    backgroundColor: '#F0F0F0',
  },
  statusBarContainer: {
    height: 20,
    backgroundColor: '#C0C0C0',
    borderTopWidth: 1,
    borderTopColor: '#808080',
  },
});

export default Shell;
