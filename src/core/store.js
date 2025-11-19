/**
 * Visual Node.js - Global Store (Zustand)
 * Manages the state of the IDE: current project, open files, selected controls, etc.
 */

import { create } from 'zustand';
import standardExe from '../templates/standard-exe';
import IntelliSenseGenerator from './intellisense';
import ProjectManager from './project-manager';
import NodeBridge from '../bridge/node-bridge';

const useStore = create((set, get) => ({
  // Project State
  project: null,
  setProject: (project) => set({ project }),

  // Editor State
  activeFile: 'index.js', // Default to entry point
  setActiveFile: (fileName) => set({ activeFile: fileName }),

  // Designer State
  selectedControl: null,
  setSelectedControl: (controlId) => set({ selectedControl: controlId }),

  selectedTool: 'Pointer',
  setSelectedTool: (tool) => set({ selectedTool: tool }),

  controls: [], // Will be loaded from layout
  addControl: (control) => set((state) => {
      const newControls = [...state.controls, control];
      
      // Update IntelliSense definitions
      const dts = IntelliSenseGenerator.generateDefinitions(newControls);
      // In a real app, we would write this to a file or inject it into Monaco
      // For now, we'll store it in fileContents so MonacoWrapper can pick it up if we wire it
      const newFileContents = { ...state.fileContents, 'globals.d.ts': dts };
      
      return { 
          controls: newControls,
          fileContents: newFileContents
      };
  }),
  
  updateControlProperty: (id, key, value) => set((state) => ({
    controls: state.controls.map((c) => {
      if (c.id !== id) return c;
      if (key === 'Caption' || key === 'Text') return { ...c, text: value };
      if (key === 'Left') return { ...c, x: parseInt(value) || 0 };
      if (key === 'Top') return { ...c, y: parseInt(value) || 0 };
      if (key === 'Width') return { ...c, width: parseInt(value) || 0 };
      if (key === 'Height') return { ...c, height: parseInt(value) || 0 };
      return { ...c, [key]: value };
    })
  })),

  // File System (In-Memory for Prototype)
  files: [],
  fileContents: {},
  isRunning: false, // Track if the project is running

  updateFileContent: (fileName, content) => {
      set((state) => ({
          fileContents: { ...state.fileContents, [fileName]: content }
      }));

      // JIT / Edit and Continue
      const { isRunning } = get();
      if (isRunning && fileName.endsWith('.js')) {
          // Debounce could be added here
          NodeBridge.sendPatch(fileName, content);
      }
  },

  setIsRunning: (running) => set({ isRunning: running }),

  addEventHandler: (controlId, eventName) => set((state) => {
      const fileName = 'Form1.js'; // Hardcoded for prototype
      let content = state.fileContents[fileName] || '';
      
      const handlerName = `${controlId}_${eventName}`;
      // Simple check if handler exists
      if (!content.includes(handlerName)) {
          const newHandler = `\n\n// ${handlerName}\nexports.${handlerName} = function() {\n  console.log('${controlId} ${eventName}');\n};\n`;
          content += newHandler;
      }
      
      return {
          fileContents: { ...state.fileContents, [fileName]: content },
          activeFile: fileName,
          editorMode: 'code'
      };
  }),

  // Actions
  initProject: () => {
      const template = standardExe;
      const files = template.files.map(f => f.path);
      const fileContents = {};
      template.files.forEach(f => {
          fileContents[f.path] = typeof f.content === 'string' ? f.content : JSON.stringify(f.content, null, 2);
      });

      // Add a default Form1 for visual demonstration
      files.push('Form1.js');
      files.push('Form1.layout.json');
      
      // Update index.js to show Form1 (Mocking the VB6 "Startup Object" behavior)
      // In a real app, we'd parse the AST or have a project setting.
      // Here we just overwrite index.js for the prototype to ensure the Form code runs or is at least present.
      // Actually, let's just leave index.js as is (Console Hello World) for the first run test.
      
      fileContents['Form1.js'] = "// Form1 Code Behind\n\nexports.Form_Load = function() {\n  console.log('Form Loaded');\n}";
      fileContents['Form1.layout.json'] = JSON.stringify({ name: 'Form1', controls: [] }, null, 2);

      set({
          project: { name: template.name },
          files,
          fileContents,
          activeFile: 'Form1.js',
          editorMode: 'design'
      });
  },

  saveAll: () => {
      const { project, fileContents } = get();
      if (project && project.path) {
          // In a real app, project.path would be set on load/create
          // For prototype, we might need to mock a path if not set
          const targetPath = project.path || '/Users/imac/Dev/visual-nodejs/my-project'; 
          
          // Ensure we have a project structure in memory to save to
          // For now, we just pass the file contents map
          ProjectManager.currentProject = { path: targetPath }; // Hack for prototype
          ProjectManager.saveProject(fileContents);
      } else {
          console.log('No project path to save to.');
      }
  },

  // Mode: 'design' or 'code'
  editorMode: 'design',
  setEditorMode: (mode) => set({ editorMode: mode }),
}));

export default useStore;
