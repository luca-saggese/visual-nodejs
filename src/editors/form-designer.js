/**
 * Visual Node.js - Form Designer
 * A visual surface for dragging and dropping controls.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import useStore from '../core/store';

const FormDesigner = () => {
  const { selectedControl, setSelectedControl, controls, addControl, selectedTool, setSelectedTool, addEventHandler } = useStore();
  const [lastTap, setLastTap] = useState(null);

  const handleControlPress = (controlId) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
        // Double tap detected
        addEventHandler(controlId, 'Click');
    } else {
        setLastTap(now);
        setSelectedControl(controlId);
    }
  };

  const handleCanvasPress = (e) => {
    // In a real app, we'd calculate relative coordinates properly
    const { locationX, locationY } = e.nativeEvent;
    
    if (selectedTool !== 'Pointer') {
        const newControl = {
            id: `${selectedTool}${controls.length + 1}`,
            type: selectedTool,
            text: selectedTool,
            x: locationX || 10,
            y: locationY || 10,
            width: 100,
            height: 30
        };
        addControl(newControl);
        setSelectedControl(newControl.id);
        setSelectedTool('Pointer'); // Reset to pointer after placing
    } else {
        setSelectedControl(null);
    }
  };

  return (
    <Pressable style={styles.canvas} onPress={handleCanvasPress}>
      {controls.map((control) => (
        <TouchableOpacity
          key={control.id}
          style={[
            styles.control,
            {
              left: control.x,
              top: control.y,
              width: control.width,
              height: control.height,
              borderColor: selectedControl === control.id ? '#0000FF' : '#999',
              borderWidth: selectedControl === control.id ? 2 : 1,
            },
          ]}
          onPress={() => handleControlPress(control.id)}
        >
          <Text style={styles.controlText}>
            {control.type === 'Button' ? control.text : `[${control.text}]`}
          </Text>
          {/* Resize handles would go here */}
          {selectedControl === control.id && <View style={styles.resizeHandle} />}
        </TouchableOpacity>
      ))}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Form background
    position: 'relative',
  },
  control: {
    position: 'absolute',
    backgroundColor: '#d4d0c8', // Classic button gray
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  controlText: {
    fontSize: 12,
    color: 'black',
  },
  resizeHandle: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 8,
    height: 8,
    backgroundColor: '#000080',
  }
});

export default FormDesigner;
