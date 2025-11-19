/**
 * Visual Node.js - Node Bridge
 * Manages the communication between the React Native UI and the Node.js child processes.
 */

const EventEmitter = require('events');
const cp = require('child_process'); 
const path = require('path');

class NodeBridge extends EventEmitter {
  constructor() {
    super();
    this.activeProcess = null;
  }

  /**
   * Starts a user project in a separate Node.js process.
   * @param {string} projectPath - Path to the project root.
   */
  runProject(projectPath) {
    console.log(`Bridge: Starting project at ${projectPath}`);
    this.emit('stdout', 'Build started...');

    // 1. Locate the Runner
    // In a real app, this path needs to be resolved correctly relative to the bundle
    const runnerPath = path.resolve(__dirname, '../runtime/runner.js');
    
    // 2. Spawn the process
    try {
        // We pass the project path as an argument to the runner
        // For the new build system, we want to run 'start_debug.js' inside the build directory
        // But our runner.js expects a project path and looks for package.json.
        // Let's modify how we call it.
        
        // We'll tell runner to execute 'start_debug.js' directly if it exists in the target path
        
        this.activeProcess = cp.spawn('node', [runnerPath, projectPath], {
            cwd: projectPath || process.cwd(),
            stdio: ['pipe', 'pipe', 'pipe', 'ipc'] // Enable IPC for messaging
        });

        this.emit('stdout', `Process spawned with PID: ${this.activeProcess.pid}`);

        // 3. Listen to Output
        this.activeProcess.stdout.on('data', (data) => {
            this.emit('stdout', data.toString());
        });

        this.activeProcess.stderr.on('data', (data) => {
            this.emit('stdout', `Error: ${data.toString()}`); // Redirect stderr to immediate window
        });

        this.activeProcess.on('close', (code) => {
            this.emit('stdout', `Process exited with code ${code}`);
            this.activeProcess = null;
        });

        // 4. Listen to IPC messages (from Runtime)
        this.activeProcess.on('message', (msg) => {
            console.log('Bridge received:', msg);
        });

    } catch (err) {
        this.emit('stdout', `Failed to spawn process: ${err.message}`);
    }
  }

  /**
   * Stops the currently running project.
   */
  stopProject() {
    if (this.activeProcess) {
      console.log('Bridge: Stopping project...');
      this.activeProcess.kill();
      this.activeProcess = null;
      this.emit('stdout', 'Process stopped by user.');
    }
  }

  /**
   * Sends a command to the active process (e.g., for debugging or REPL).
   * @param {string} command 
   */
  sendCommand(command) {
    if (this.activeProcess && this.activeProcess.send) {
        this.activeProcess.send({ type: 'eval', code: command });
    } else {
        this.emit('stdout', 'No active process.');
    }
  }

  /**
   * Sends a hot patch to the active process.
   * @param {string} fileName 
   * @param {string} code 
   */
  sendPatch(fileName, code) {
      if (this.activeProcess && this.activeProcess.send) {
          console.log(`Bridge: Sending patch for ${fileName}`);
          this.activeProcess.send({ type: 'patch', fileName, code });
      }
  }
}

export default new NodeBridge();
