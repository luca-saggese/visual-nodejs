/**
 * Visual Node.js - Debugger Client
 * Connects to the Node.js Inspector Protocol to support debugging features.
 */

const WebSocket = require('ws');

class NodeInspectorClient {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.callbacks = {}; // Map ID to promise resolve/reject
  }

  /**
   * Connects to the debugger WebSocket URL.
   * @param {string} url - The inspector URL (e.g., ws://localhost:9229/...)
   */
  connect(url) {
    console.log(`Debugger: Connecting to ${url}`);
    
    const tryConnect = () => {
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

        this.ws.on('error', (err) => {
            console.log('Debugger connection error, retrying...', err.message);
            setTimeout(tryConnect, 1000);
        });
        
        this.ws.on('close', () => {
            this.isConnected = false;
            console.log('Debugger: Disconnected');
        });
    };

    tryConnect();
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
    const id = Date.now(); 
    const message = JSON.stringify({ id, method, params });
    this.ws.send(message);
    return id; // Return ID to track response
  }

  /**
   * Disconnects from the debugger.
   */
  disconnect() {
      if (this.ws) {
          this.ws.close();
          this.ws = null;
          this.isConnected = false;
      }
  }

  /**
   * Evaluates an expression in the runtime.
   * @param {string} expression 
   */
  evaluate(expression) {
      return new Promise((resolve, reject) => {
          const id = this.sendMessage('Runtime.evaluate', { expression, includeCommandLineAPI: true });
          if (id) {
              this.callbacks[id] = { resolve, reject };
          } else {
              reject(new Error('Not connected'));
          }
      });
  }

  handleMessage(message) {
    // Handle responses
    if (message.id && this.callbacks[message.id]) {
        const { resolve, reject } = this.callbacks[message.id];
        if (message.error) {
            reject(message.error);
        } else {
            resolve(message.result);
        }
        delete this.callbacks[message.id];
        return;
    }

    // Handle events like 'Debugger.paused', 'Runtime.consoleAPICalled', etc.
    if (message.method === 'Runtime.consoleAPICalled') {
        console.log('App Console:', message.params.args[0].value);
    }
  }
}

module.exports = new NodeInspectorClient();
