/**
 * Visual Node.js - Compiler / Transpiler
 * Transforms "Visual Node" files into standard executable JavaScript.
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const os = require('os');

class Compiler {
  /**
   * Transpiles a visual form layout and code behind into a React component.
   * @param {object} layout - The JSON layout definition.
   * @param {string} code - The JavaScript code behind.
   * @returns {string} The generated React Native component code.
   */
  transpile(layout, code) {
    console.log(`Transpiling ${layout.name}...`);
    
    const controls = layout.controls || [];
    
    // Generate JSX for controls
    const jsxElements = controls.map(c => {
        const style = `{{ position: 'absolute', left: ${c.x}, top: ${c.y}, width: ${c.width}, height: ${c.height}, borderWidth: 1, borderColor: '#999', justifyContent: 'center', alignItems: 'center', backgroundColor: '#d4d0c8' }}`;
        
        // Event binding (naive implementation)
        const onPress = c.type === 'Button' ? `onPress={() => this.${c.id}_Click && this.${c.id}_Click()}` : '';
        
        if (c.type === 'Button') {
            return `<TouchableOpacity style=${style} ${onPress}><Text>${c.text}</Text></TouchableOpacity>`;
        }
        if (c.type === 'TextBox') {
            return `<TextInput style=${style} value="${c.text}" />`;
        }
        if (c.type === 'Label') {
            return `<Text style=${style}>${c.text}</Text>`;
        }
        // Default fallback
        return `<View style=${style}><Text>${c.text}</Text></View>`;
    }).join('\n        ');

    // Wrap in Class Component
    const component = `
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

export default class ${layout.name} extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // --- User Code Begin ---
  ${code}
  // --- User Code End ---

  render() {
    return (
      <View style={styles.container}>
        ${jsxElements}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  }
});
`;
    return component;
  }

  /**
   * Transpiles the layout to a simple HTML/JS string for the web runtime (Prototype).
   */
  transpileToWeb(layout, code) {
      const controls = layout.controls || [];
      
      const css = `
        body { background-color: #f0f0f0; font-family: sans-serif; }
        .form-container { position: relative; width: 100%; height: 100vh; }
        .control { position: absolute; border: 1px solid #999; background-color: #d4d0c8; display: flex; justify-content: center; align-items: center; box-sizing: border-box; cursor: default; }
        .control:active { border-style: inset; }
        button.control { cursor: pointer; }
        input.control { background-color: white; border: 1px solid #7f9db9; cursor: text; }
      `;

      const htmlControls = controls.map(c => {
          const style = `left: ${c.x}px; top: ${c.y}px; width: ${c.width}px; height: ${c.height}px;`;
          const id = c.id;
          
          if (c.type === 'Button') {
              return `<button id="${id}" class="control" style="${style}" onclick="handleEvent('${id}', 'Click')">${c.text}</button>`;
          }
          if (c.type === 'TextBox') {
              return `<input id="${id}" class="control" style="${style}" value="${c.text}" onchange="handleEvent('${id}', 'Change', this.value)" />`;
          }
          if (c.type === 'Label') {
              return `<div id="${id}" class="control" style="${style}; border: none; background: transparent;">${c.text}</div>`;
          }
          return `<div id="${id}" class="control" style="${style}">${c.text}</div>`;
      }).join('\n');

      // Extract event handlers from code (Very naive regex parsing for prototype)
      // Looking for: exports.Command1_Click = function() { ... }
      // We'll just inject the whole code block and hope it exposes functions we can call or wrap.
      // For the prototype, we'll use a bridge to send events back to the Node process.
      
      const script = `
        const ws = new WebSocket('ws://localhost:3001');
        
        ws.onopen = () => {
            console.log('Connected to Runtime Bridge');
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === 'eval_result') {
                console.log(msg.result);
            }
        };

        function handleEvent(id, event, value) {
            const payload = { type: 'event', id, event, value };
            ws.send(JSON.stringify(payload));
        }
      `;

      return `
<!DOCTYPE html>
<html>
<head>
    <style>${css}</style>
</head>
<body>
    <div class="form-container">
        ${htmlControls}
    </div>
    <script>${script}</script>
</body>
</html>
      `;
  }

  /**
   * Runs the build process using esbuild.
   */
  async build() {
    console.log('Running build...');
    // esbuild configuration
  }

  /**
   * Builds the current project state into a temporary directory for execution.
   * @param {object} fileContents - Map of filename to content.
   * @returns {string} The path to the build directory.
   */
  buildRun(fileContents) {
    console.log('Compiler: Building for run...');
    
    // Create temp dir
    const buildDir = path.join(os.tmpdir(), 'visual-node-build-' + Date.now());
    fs.mkdirSync(buildDir, { recursive: true });

    // Write files
    Object.entries(fileContents).forEach(([filename, content]) => {
        fs.writeFileSync(path.join(buildDir, filename), content);
        
        // If it's a layout, also generate the HTML preview
        if (filename.endsWith('.layout.json')) {
            const layout = JSON.parse(content);
            const jsFilename = filename.replace('.layout.json', '.js');
            const code = fileContents[jsFilename] || '';
            
            const html = this.transpileToWeb(layout, code);
            fs.writeFileSync(path.join(buildDir, layout.name + '.html'), html);
        }
    });

    // Generate a server.js to serve the forms
    const serverCode = `
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './Form1.html'; // Default to Form1

    const extname = path.extname(filePath);
    let contentType = 'text/html';

    fs.readFile(path.join(__dirname, filePath), (error, content) => {
        if (error) {
            res.writeHead(500);
            res.end('Error: ' + error.code);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('GUI Server running at http://localhost:' + PORT);
    // Open browser
    const start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
    exec(start + ' http://localhost:' + PORT);
});
    `;
    fs.writeFileSync(path.join(buildDir, 'server.js'), serverCode);

    // Update package.json to start the server instead of index.js for this run
    // Or better, create a runner script that starts both the user logic and the server.
    // For now, let's assume the user logic IS the server logic for the GUI part.
    
    // We'll create a 'start_debug.js' that requires the user code AND starts the server
    const startDebug = `
// Start the GUI Server
require('./server.js');

// Start the User Logic (simulated entry point)
// In a real app, we'd need to hook the events from the server to the user functions.
const userCode = require('./Form1.js');
const WebSocket = require('ws');

// Connect to the Runtime Bridge to receive events from the browser
const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => {
    console.log('User Logic connected to Bridge');
});

ws.on('message', (data) => {
    const msg = JSON.parse(data);
    if (msg.type === 'event') {
        // Dispatch to user code
        const handlerName = msg.id + '_' + msg.event;
        if (userCode[handlerName]) {
            console.log('Invoking ' + handlerName);
            try {
                userCode[handlerName]();
            } catch (e) {
                console.error(e);
            }
        }
    }
});
    `;
    fs.writeFileSync(path.join(buildDir, 'start_debug.js'), startDebug);

    // Create a dummy package.json if needed or rely on the one copied
    // We need 'ws' dependency.
    
    console.log(`Compiler: Build successful at ${buildDir}`);
    return buildDir;
  }
}

module.exports = new Compiler();
