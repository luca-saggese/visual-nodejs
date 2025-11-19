import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useStore from '../core/store';

const Menu = () => {
  const { saveAll } = useStore();
  const menus = [
      { label: 'File', action: null }, 
      { label: 'Save', action: saveAll }, // Simplified for prototype: Top level Save
      { label: 'Edit', action: null }, 
      { label: 'View', action: null }, 
      { label: 'Project', action: null }, 
      { label: 'Run', action: null }
  ];

  return (
    <View style={styles.container}>
      {menus.map((menu, index) => (
        <TouchableOpacity key={index} style={styles.menuItem} onPress={menu.action}>
          <Text style={styles.menuText}>{menu.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderColor: '#808080',
    paddingHorizontal: 5,
    height: 24,
    alignItems: 'center',
  },
  menuItem: {
    paddingHorizontal: 8,
  },
  menuText: {
    fontSize: 12,
    color: 'black',
  }
});

export default Menu;
