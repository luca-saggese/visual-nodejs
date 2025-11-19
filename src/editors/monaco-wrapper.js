/**
 * Visual Node.js - Monaco Editor Wrapper
 * This component would wrap the Monaco Editor inside a WebView for React Native.
 */

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useStore } from '../store'; // Adjust the import based on your project structure

const HTML_CONTENT = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Monaco Editor</title>
    <style>
        html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: #1e1e1e; }
        #container { height: 100%; width: 100%; }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs/loader.min.js"></script>
</head>
<body>
    <div id="container"></div>
    <script>
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs' }});
        
        let editor;

        require(['vs/editor/editor.main'], function() {
            editor = monaco.editor.create(document.getElementById('container'), {
                value: '',
                language: 'javascript',
                theme: 'vs-dark',
                automaticLayout: true,
                minimap: { enabled: false }
            });

            // Notify React Native that editor is ready
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'editor-ready' }));

            // Handle changes
            editor.onDidChangeModelContent(() => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'content-change',
                    value: editor.getValue()
                }));
            });
        });

        // Listen for messages from React Native
        document.addEventListener('message', function(event) {
            handleMessage(event.data);
        });
        
        window.addEventListener('message', function(event) {
            handleMessage(event.data);
        });

        function handleMessage(data) {
            try {
                const msg = JSON.parse(data);
                if (msg.type === 'set-value') {
                    if (editor && editor.getValue() !== msg.value) {
                        editor.setValue(msg.value);
                    }
                }
                if (msg.type === 'set-language') {
                    if (editor) {
                        monaco.editor.setModelLanguage(editor.getModel(), msg.language);
                    }
                }
                if (msg.type === 'add-extra-lib') {
                    // Register the d.ts file
                    monaco.languages.typescript.javascriptDefaults.addExtraLib(msg.value, 'globals.d.ts');
                }
            } catch (e) {
                console.error(e);
            }
        }
    </script>
</body>
</html>
`;

const MonacoWrapper = ({ code, language, onChange }) => {
  const webViewRef = useRef(null);
  const { fileContents } = useStore(); // Access global definitions

  useEffect(() => {
    if (webViewRef.current) {
      // Send code
      webViewRef.current.postMessage(JSON.stringify({
        type: 'set-value',
        value: code
      }));
      
      // Send extra libs (IntelliSense)
      if (fileContents['globals.d.ts']) {
          webViewRef.current.postMessage(JSON.stringify({
            type: 'add-extra-lib',
            value: fileContents['globals.d.ts']
          }));
      }
    }
  }, [code, fileContents]);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'content-change' && onChange) {
        onChange(data.value);
      }
      if (data.type === 'editor-ready') {
          // Initial sync
          webViewRef.current.postMessage(JSON.stringify({
            type: 'set-value',
            value: code
          }));
      }
    } catch (e) {
      console.error('MonacoWrapper message error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: HTML_CONTENT }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        originWhitelist={['*']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  }
});

export default MonacoWrapper;
