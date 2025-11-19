import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Bar (Menu) */}
      <Menu />
      <Toolbar />
      
      <View style={styles.mainContent}>
        {/* Left Panel */}
        <View style={styles.leftPanel}>
          <Toolbox />
        </View>

        {/* Center Area (MDI/Editors) */}
        <View style={styles.centerPanel}>
          <EditorArea />
          <ImmediateWindow />
        </View>

        {/* Right Panel */}
        <View style={styles.rightPanel}>
          <View style={styles.rightTop}>
            <ProjectExplorer />
          </View>
          <View style={styles.rightMiddle}>
            <PropertiesPanel />
          </View>
          <View style={styles.rightBottom}>
            <FormLayout />
          </View>
        </View>
      </View>

      {/* Status Bar */}
      <StatusBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#C0C0C0', // Classic VB6 gray
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    width: 50,
    borderRightWidth: 1,
    borderColor: '#808080',
    backgroundColor: '#E0E0E0',
  },
  centerPanel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#808080',
    margin: 2,
  },
  rightPanel: {
    width: 250,
    borderLeftWidth: 1,
    borderColor: '#808080',
    flexDirection: 'column',
  },
  rightTop: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#808080',
  },
  rightMiddle: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#808080',
  },
  rightBottom: {
    height: 150, // Fixed height for Form Layout usually
    backgroundColor: '#E0E0E0',
  },
});

export default Shell;
