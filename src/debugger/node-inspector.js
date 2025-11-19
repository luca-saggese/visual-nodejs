/**
 * Visual Node.js - Debugger Client
 * Connects to the Node.js Inspector Protocol to support debugging features.
 */

const WebSocket = require('ws');

class NodeInspectorClient {
  constructor() {
    this.ws = null;
    this.isConnected = false;
  }

  /**
   * Connects to the debugger WebSocket URL.
   * @param {string} url - The inspector URL (e.g., ws://localhost:9229/...)
   */
  connect(url) {
    console.log(`Debugger: Connecting to ${url}`);
    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      this.isConnected = true;
      console.log('Debugger: Connected');
      this.enable();
    });

    this.ws.on('message', (data) => {
      const message = JSON.parse(data);
      this.handleMessage(message);
    });
  }

  /**
   * Enables the debugger domains.
   */
  enable() {
    this.sendMessage('Debugger.enable');
    this.sendMessage('Runtime.enable');
  }

  /**
   * Sends a message to the inspector.
   * @param {string} method - The method name (e.g., 'Debugger.pause')
   * @param {object} params - Optional parameters
   */
  sendMessage(method, params = {}) {
    if (!this.isConnected) return;
    const id = Date.now(); // Simple ID generation
    const message = JSON.stringify({ id, method, params });
    this.ws.send(message);
  }

  handleMessage(message) {
    // Handle events like 'Debugger.paused', 'Runtime.consoleAPICalled', etc.
    if (message.method === 'Runtime.consoleAPICalled') {
        console.log('App Console:', message.params.args[0].value);
    }
  }
}

module.exports = new NodeInspectorClient();
