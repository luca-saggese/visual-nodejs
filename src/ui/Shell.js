import React, { useEffect, useState } from 'react';
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
import ResizableSplitter from './ResizableSplitter';
import useStore from '../core/store';

const Shell = () => {
  const { initProject } = useStore();
  
  // Panel widths and heights state
  const [leftPanelWidth, setLeftPanelWidth] = useState(80);
  const [rightPanelWidth, setRightPanelWidth] = useState(250);
  const [immediateWindowHeight, setImmediateWindowHeight] = useState(150);
  const [projectExplorerHeight, setProjectExplorerHeight] = useState(200);
  const [propertiesPanelHeight, setPropertiesPanelHeight] = useState(200);

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
          <View style={[styles.leftPanel, { width: leftPanelWidth }]}>
            <Toolbox />
          </View>

          {/* Splitter between Left and Center */}
          <ResizableSplitter
            direction="horizontal"
            onResize={(delta) => {
              setLeftPanelWidth(prev => Math.max(60, Math.min(300, prev + delta)));
            }}
          />

          {/* Center Panel - Editor + Immediate Window */}
          <View style={styles.centerPanel}>
            <View style={styles.editorArea}>
              <EditorArea />
            </View>
            
            {/* Splitter between Editor and Immediate Window */}
            <ResizableSplitter
              direction="vertical"
              onResize={(delta) => {
                setImmediateWindowHeight(prev => Math.max(100, Math.min(400, prev - delta)));
              }}
            />
            
            <View style={[styles.immediateWindow, { height: immediateWindowHeight }]}>
              <ImmediateWindow />
            </View>
          </View>

          {/* Splitter between Center and Right */}
          <ResizableSplitter
            direction="horizontal"
            onResize={(delta) => {
              setRightPanelWidth(prev => Math.max(200, Math.min(500, prev - delta)));
            }}
          />

          {/* Right Panel - Project Explorer + Properties + Form Layout */}
          <View style={[styles.rightPanel, { width: rightPanelWidth }]}>
            <View style={[styles.projectExplorer, { height: projectExplorerHeight }]}>
              <ProjectExplorer />
            </View>
            
            {/* Splitter between Project Explorer and Properties */}
            <ResizableSplitter
              direction="vertical"
              onResize={(delta) => {
                setProjectExplorerHeight(prev => Math.max(100, Math.min(400, prev + delta)));
              }}
            />
            
            <View style={[styles.propertiesPanel, { height: propertiesPanelHeight }]}>
              <PropertiesPanel />
            </View>
            
            {/* Splitter between Properties and Form Layout */}
            <ResizableSplitter
              direction="vertical"
              onResize={(delta) => {
                setPropertiesPanelHeight(prev => Math.max(100, Math.min(400, prev + delta)));
              }}
            />
            
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
    flex: 1,
    borderWidth: 1,
    borderColor: '#808080',
    margin: 2,
  },
  immediateWindow: {
    borderWidth: 1,
    borderColor: '#808080',
    margin: 2,
  },
  // Right Panel
  rightPanel: {
    overflow: 'hidden',
    flexDirection: 'column',
    backgroundColor: '#E0E0E0',
    borderLeftWidth: 1,
    borderLeftColor: '#808080',
  },
  projectExplorer: {
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
  },
  propertiesPanel: {
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
  },
  formLayout: {
    flex: 1,
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
