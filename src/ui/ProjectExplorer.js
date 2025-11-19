import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import Panel from './Panel';
import useStore from '../core/store';

const ProjectExplorer = () => {
  const { files, setActiveFile, activeFile } = useStore();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null });

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.js')) return '📄';
    if (fileName.endsWith('.json')) return '⚙️';
    if (fileName.endsWith('.frm')) return '🖼️';
    return '📄';
  };

  const getFolderIcon = (expanded) => expanded ? '📂' : '📁';

  const handleRightClick = (e, item) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
      item
    });
  };

  const handleMenuAction = (action) => {
    console.log(`Action: ${action} on ${contextMenu.item}`);
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
    // TODO: Implement actions (Add, Remove, Rename, etc.)
  };

  return (
    <Panel title="Project Explorer" titleBarColor="#000080">
      <ScrollView style={styles.content}>
        <View style={styles.treeNode}>
          <Text style={styles.projectNode}>
            <Text style={styles.icon}>💼</Text> Project1 (vbp)
          </Text>
        </View>
        
        <View style={styles.indented}>
          <View style={styles.treeNode}>
            <Text style={styles.folderNode}>
              <Text style={styles.icon}>{getFolderIcon(true)}</Text> Forms
            </Text>
          </View>
          
          <View style={styles.indented}>
            {files.filter(f => f.endsWith('.js') || f.endsWith('.layout.json')).map((file, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.fileNodeContainer,
                  activeFile === file && styles.selectedNode
                ]}
                onPress={() => setActiveFile(file)}
                onLongPress={(e) => handleRightClick(e, file)}
              >
                <Text style={[styles.fileNode, activeFile === file && styles.selectedText]}>
                  <Text style={styles.icon}>{getFileIcon(file)}</Text> {file}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Context Menu */}
      {contextMenu.visible && (
        <Modal
          transparent
          visible={contextMenu.visible}
          onRequestClose={() => setContextMenu({ visible: false, x: 0, y: 0, item: null })}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setContextMenu({ visible: false, x: 0, y: 0, item: null })}
          >
            <View style={[styles.contextMenu, { left: contextMenu.x, top: contextMenu.y }]}>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuAction('open')}>
                <Text style={styles.menuText}>Open</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuAction('add')}>
                <Text style={styles.menuText}>Add...</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuAction('remove')}>
                <Text style={styles.menuText}>Remove</Text>
              </TouchableOpacity>
              <View style={styles.menuSeparator} />
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuAction('rename')}>
                <Text style={styles.menuText}>Rename</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuAction('properties')}>
                <Text style={styles.menuText}>Properties</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </Panel>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 5,
  },
  treeNode: {
    marginBottom: 2,
  },
  indented: {
    paddingLeft: 16,
  },
  icon: {
    fontSize: 14,
    marginRight: 4,
  },
  projectNode: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 4,
  },
  folderNode: {
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 2,
  },
  fileNodeContainer: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  fileNode: {
    fontSize: 12,
    color: '#000',
  },
  selectedNode: {
    backgroundColor: '#0078D4',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contextMenu: {
    position: 'absolute',
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 2,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  menuText: {
    fontSize: 12,
    color: '#000',
  },
  menuSeparator: {
    height: 1,
    backgroundColor: '#C0C0C0',
    marginVertical: 2,
  },
});

export default ProjectExplorer;
