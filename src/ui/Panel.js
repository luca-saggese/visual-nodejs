import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Panel = ({ 
  title, 
  children, 
  style,
  titleBarColor = '#0078D4',
  titleTextColor = '#FFFFFF',
  showTitleBar = true 
}) => {
  return (
    <View style={[styles.panel, style]}>
      {showTitleBar && (
        <View style={[styles.titleBar, { backgroundColor: titleBarColor }]}>
          <Text style={[styles.titleText, { color: titleTextColor }]}>
            {title}
          </Text>
        </View>
      )}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#808080',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  titleBar: {
    height: 24,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
  },
  titleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
});

export default Panel;
