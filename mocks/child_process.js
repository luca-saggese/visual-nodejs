const EventEmitter = require('events');

class MockStream extends EventEmitter {}
class MockProcess extends EventEmitter {
  constructor() {
    super();
    this.stdout = new MockStream();
    this.stderr = new MockStream();
    this.pid = Math.floor(Math.random() * 10000);
    
    setTimeout(() => {
        this.stdout.emit('data', 'Visual Node.js Runtime (Mock Environment)\n');
    }, 100);
    
    setTimeout(() => {
        this.stdout.emit('data', 'Running in React Native macOS...\n');
        this.stdout.emit('data', 'Note: Native Node.js spawning is mocked in this prototype.\n');
    }, 500);
  }
  
  kill() {
      this.emit('exit', 0);
  }
}

module.exports = {
  spawn: (command, args, options) => {
    console.log('Mock spawn:', command, args);
    return new MockProcess();
  },
  exec: (command, callback) => {
      console.log('Mock exec:', command);
      if (callback) callback(null, 'Mock Output', '');
  }
};
