import React from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';

const ResizableSplitter = ({ 
  direction = 'horizontal', // 'horizontal' or 'vertical'
  onResize,
  thickness = 4,
  color = '#3c3c3c',
  hoverColor = '#007acc'
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const lastPositionRef = React.useRef({ x: 0, y: 0 });

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsHovered(true);
        lastPositionRef.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
      },
      onPanResponderMove: (evt, gestureState) => {
        if (onResize) {
          const currentX = evt.nativeEvent.pageX;
          const currentY = evt.nativeEvent.pageY;
          
          if (direction === 'horizontal') {
            const delta = currentX - lastPositionRef.current.x;
            if (delta !== 0) {
              onResize(delta);
              lastPositionRef.current.x = currentX;
            }
          } else {
            const delta = currentY - lastPositionRef.current.y;
            if (delta !== 0) {
              onResize(delta);
              lastPositionRef.current.y = currentY;
            }
          }
        }
      },
      onPanResponderRelease: () => {
        setIsHovered(false);
      },
    })
  ).current;

  const style = direction === 'horizontal' 
    ? {
        width: thickness,
        height: '100%',
        cursor: 'col-resize',
      }
    : {
        width: '100%',
        height: thickness,
        cursor: 'row-resize',
      };

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.splitter,
        style,
        { backgroundColor: isHovered ? hoverColor : color }
      ]}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};

const styles = StyleSheet.create({
  splitter: {
    flexShrink: 0,
  },
});

export default ResizableSplitter;
