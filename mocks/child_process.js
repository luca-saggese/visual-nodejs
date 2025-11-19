module.exports = {
  spawn: () => ({
    pid: 123,
    stdout: { on: () => {} },
    stderr: { on: () => {} },
    on: () => {},
    kill: () => {}
  }),
  exec: () => {}
};
