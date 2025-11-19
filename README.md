# Technical Design Document: Visual Node.js

## 1. Vision and Objective
Create a native desktop IDE for macOS (Visual Node.js) that replicates the user experience ("Look & Feel") and workflow of Microsoft Visual Basic 6.0, but intended for modern Node.js application development.

The IDE must not be limited to writing code, but must "abstract" the complexity of Node.js behind a visual interface, maintaining a 1:1 mapping between VB6 concepts and Node.js.

### Technology Stack:
- **Core Framework:** React Native for macOS (for native performance and OS integration).
- **Code Editor:** Monaco Editor (integrated via WebView bridge, necessary for advanced intellisense features).
- **Runtime Target:** Node.js (the IDE runs Node, and the created apps run on Node).
- **State Management:** Redux or Zustand (to manage IDE state).

## 2. Modular Project Architecture
The IDE source code will be divided into distinct modules to ensure maintainability and extensibility.

### Directory Structure
```
/src
  /core           # IDE business logic (non-UI)
  /ui             # React Native components (Shell, Windows, Docking)
  /bridge         # Communication between RN-macOS and Node processes
  /editors        # Wrappers for Monaco and Form Designer
  /compiler       # Transpilation logic (Visual -> JS)
  /debugger       # Client for Node Inspector protocol
  /templates      # Base templates (Standard EXE equivalent)
```

## 3. Functional Mapping: VB6 vs Node.js
This section defines how each VB6 feature is translated into the Node.js world.

### 3.1. Project Management (.vbp -> package.json)
In VB6, the `.vbp` file is the heart. In Visual Node.js, `package.json` is the single source of truth.

- **Project Name:** Mapped to `name` in `package.json`.
- **Version:** Mapped to `version`.
- **References/Components:** In VB6 you added DLL/OCX. Here, the "Project > References" interface is a GUI for NPM.
    - The user searches for a library in the GUI.
    - Visual Node.js runs `npm install` in the background.
    - Adds the entry to `dependencies`.
- **Project Type (Standard EXE, ActiveX DLL):** Mapped to custom properties in `package.json` (e.g., `"visualNode": { "type": "console" | "express" | "electron" }`).
- **Startup Object:** Mapped to `main` or `scripts.start`.

### 3.2. File Structure (.frm, .bas, .cls)
Visual Node.js will use a "twin file" approach to maintain separation between design and logic, similar to VB6 but modern.

- **Form (.frm):** Becomes a folder or two files:
    - `MyForm.layout.json`: The visual definition (X/Y positions, control properties).
    - `MyForm.js`: The "Code Behind".
    - **Operation:** The internal compiler will merge these two files to generate a React component (if the target is web/desktop) or a set of routes (if backend).
- **Module (.bas):** Mapped to standard `.js` files exporting functions (e.g., `module.exports` or `export const`). The IDE imports them globally in the execution context to simulate VB6's global scope.
- **Class Module (.cls):** Mapped to ES6 Classes (`class MyClass {}`).

### 3.3. Form Designer (Visual)
The designer must support absolute positioning (pixel-perfect) to replicate the VB6 feeling.

- **Canvas:** A drop area simulating a window.
- **Toolbox:** Drag & drop of components.
    - CommandButton -> `<button>` (or wrapper React component).
    - TextBox -> `<input>`.
    - Label -> `<span>`.
- **Properties:** Modifying "Caption" in the properties panel updates the JSON and rendering in real-time.

### 3.4. Code Editor (Code View)
Use of Monaco Editor.
- **Object/Event Dropdowns:** At the top of the editor (like in VB6) there are two dropdowns:
    - Left: Object list (e.g., `Command1`).
    - Right: Event list (e.g., `Click`).
- Selecting `Command1` and `Click`, the IDE automatically generates the skeleton:
```javascript
// VB6: Private Sub Command1_Click()
// Visual Node:
app.on('Command1_Click', (e) => {
   // cursor here
});
```

## 4. Just-In-Time (JIT) Editing & Debugging
This is the most complex feature: replicating "Edit and Continue".

### 4.1. The Runtime Environment
When pressing F5 (Run), Visual Node.js doesn't simply launch `node index.js`.
It launches a "wrapper" Node.js process with the `--inspect` flag enabled and a custom Hot Module Replacement (HMR) system.

### 4.2. "Edit and Continue" Implementation
- **File Watcher:** The IDE observes files modified in memory (Monaco Model).
- **Patching:** When the user modifies a function while the program is paused (or running):
    - The IDE sends the new code to the Node process via WebSocket/IPC.
    - The wrapper uses Node's `vm` API or recompiles the module on the fly, replacing the function definition in the active process memory without restarting it.
- **Immediate Window:**
    - Replicates the VB6 "Immediate" window.
    - User writes `? myVariable`.
    - The IDE sends the command to the debugger inspector which evaluates the expression in the context of the current stack frame.

## 5. User Interface (UI/UX) - Docking System
The interface must be MDI (Multiple Document Interface) or SDI Dockable (VB6 style).

### Component Layout (React Native macOS)
We will use a window management library (or custom flexbox implementation) to create the areas:

- **Top Bar:** Classic menus (File, Edit, View, Project, Format, Debug, Run...).
- **Toolbar:** Start, Pause, Stop icons, Project Explorer, etc.
- **Main Area (Center):** Contains MDI windows for Forms and Code.
- **Left Panel (Toolbox):**
    - Accordion list of available controls.
    - Support for custom icons.
- **Right Top Panel (Project Explorer):**
    - Tree view (native macOS TreeView).
    - Shows Forms, Modules, Classes, References (Dependencies).
- **Right Middle Panel (Properties):**
    - Key/Value grid.
    - When a control is selected in the Form Designer, this grid populates.
    - Changes here reflect immediately in the designer.
- **Right Bottom Panel (Form Layout):**
    - Preview of the window position on screen.

## 6. Core Modules: Technical Detail

### 6.1. Project Manager (Module `ide-project`)
Responsible for reading/writing to disk.
- **Load:** Reads `package.json` and scans the directory for `.js` and `.layout.json` files. Builds a "Project Graph" in memory.
- **Save:** Serializes IDE state to file.

### 6.2. The Compiler / Transpiler (Module `ide-compiler`)
VB6 didn't have visible build steps, it was instant. We must simulate this.
- We will use SWC or Esbuild (for extreme speed) in the background.
- Transforms "Visual Node" files into standard executable JavaScript.
- Manages automatic injection of `require()` based on declared dependencies.

### 6.3. The Bridge (React Native <-> Node Child Process)
Since React Native macOS is the GUI, but user code runs on a separate Node instance:
- Use `child_process.spawn` to launch the user app.
- Communication via standard IPC (Inter-Process Communication) (stdin/stdout/stderr) + a dedicated WebSocket channel for advanced debug commands.

### 6.4. IntelliSense Engine
Monaco Editor has built-in TypeScript/JS support. However, to make it look like VB6:
- Need to generate `.d.ts` (type definition) files on the fly for controls dragged onto the form.
- Example: If I drag a TextBox named `txtName`, the IDE must generate `declare var txtName: TextBox;` in the background so that typing `txtName.` in the editor shows `.Text`, `.Visible`, etc.

## 7. Development Roadmap

### Phase 1: The Skeleton (MVP)
- Setup React Native macOS.
- Implementation of static docking system (VB6 Layout).
- Integration of Monaco Editor (text only).
- Working File Explorer (file system reading).

### Phase 2: The Designer & Properties
- Implement Form Designer (Canvas with Drag & Drop).
- Connect Designer and Properties Window (Two-way binding).
- Save layout to JSON.

### Phase 3: The Runtime & Mapping
- Creation of `package.json` build system.
- Implementation of "Run" button (spawns Node process).
- Console Output redirected to "Immediate" window.

### Phase 4: Debugging & JIT
- Inspector protocol integration.
- Breakpoints (click on side in Monaco -> sends command to debugger).
- Variable visualization on mouse hover.
- Attempt at Code Hot Reloading.

## 8. User Flow Example (User Story)
- **User:** Opens Visual Node.js -> "New Project" -> "Standard Node EXE".
- **IDE:** Creates folder, `package.json`, `Form1.js`, `Form1.layout.json`.
- **User:** Drags a Button onto the Form.
- **IDE:** Updates `Form1.layout.json`. Generates TS definition for `Command1`.
- **User:** Double clicks on the Button.
- **IDE:** Opens `Form1.js`, inserts `exports.Command1_Click = function() { ... }`.
- **User:** Writes `console.log("Hello " + txtName.value)`.
- **User:** Presses F5.
- **IDE:** Saves all, transpiling the layout into an Express server (or Electron window) serving the HTML generated by the layout. Launches the process.
- **App:** The window appears.
- **User:** Clicks the button.
- **IDE:** Intercepts the log and shows it in the Immediate window.
- **User:** (Without stopping the app) changes code to `console.log("Hello Modified")`.
- **IDE:** Sends the new function to the active process. On next click, the log is updated.

## Conclusion
Visual Node.js bridges the gap between the productive simplicity of the 90s and the asynchronous power of Node.js. Using React Native macOS ensures the application doesn't feel like a "website in a box", but a true professional tool, while intelligent `package.json` mapping maintains full compatibility with the existing NPM ecosystem.
