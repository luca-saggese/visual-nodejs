/**
 * Visual Node.js - Form Designer
 * A visual surface for dragging and dropping controls.
 */

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, PanResponder, Animated } from 'react-native';
import useStore from '../core/store';

const DraggableControl = ({ control, isSelected, onSelect, onUpdate, onDoublePress }) => {
    const pan = useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        pan.setValue({ x: 0, y: 0 });
    }, [control.x, control.y]);

    const panResponder = useMemo(() => 
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                onSelect(control.id);
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value
                });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (evt, gestureState) => {
                if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
                    // It was a tap, check for double tap logic here or in parent
                    onDoublePress(control.id);
                    pan.setValue({ x: 0, y: 0 });
                } else {
                    // It was a drag
                    onUpdate(control.id, 'Left', control.x + gestureState.dx);
                    onUpdate(control.id, 'Top', control.y + gestureState.dy);
                }
            }
        }), [control, onSelect, onUpdate, onDoublePress, pan]
    );

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.control,
                {
                    left: control.x,
                    top: control.y,
                    width: control.width,
                    height: control.height,
                    borderColor: isSelected ? '#0000FF' : '#999',
                    borderWidth: isSelected ? 2 : 1,
                    transform: pan.getTranslateTransform()
                },
            ]}
        >
            <Text style={styles.controlText}>
                {control.type === 'Button' ? control.text : `[${control.text}]`}
            </Text>
            {isSelected && <View style={styles.resizeHandle} />}
        </Animated.View>
    );
};

const FormDesigner = () => {
  const { selectedControl, setSelectedControl, controls, addControl, selectedTool, setSelectedTool, addEventHandler, updateControlProperty } = useStore();
  const [lastTap, setLastTap] = useState(null);

  const handleDoublePress = (controlId) => {
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 300;
      if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
          addEventHandler(controlId, 'Click');
          setLastTap(null);
      } else {
          setLastTap(now);
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
        <DraggableControl
            key={control.id}
            control={control}
            isSelected={selectedControl === control.id}
            onSelect={setSelectedControl}
            onUpdate={updateControlProperty}
            onDoublePress={handleDoublePress}
        />
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
