/**
 * Visual Node.js - Standard EXE Template
 * Defines the structure for a new "Standard Node EXE" project.
 */

module.exports = {
  name: "Standard Node EXE",
  description: "A standard Node.js console application.",
  files: [
    {
      path: "package.json",
      content: {
        name: "project1",
        version: "1.0.0",
        main: "index.js",
        dependencies: {}
      }
    },
    {
      path: "index.js",
      content: `
// Visual Node.js Project
// Startup Object: Sub Main

const Main = require('./Module1');

if (require.main === module) {
    Main.Main();
}
`
    },
    {
      path: "Module1.js",
      content: `
// Module1 (.bas equivalent)

function Main() {
    console.log("Hello World from Visual Node.js!");
}

module.exports = { Main };
`
    }
  ]
};
