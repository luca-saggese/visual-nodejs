/**
 * Visual Node.js - Core Project Manager
 * Handles loading and saving of project files (.json and .js).
 */

const fs = require('fs');
const path = require('path');

class ProjectManager {
  constructor() {
    this.currentProject = null;
  }

  /**
   * Loads a project from a package.json file.
   * @param {string} projectPath - Path to the project directory.
   */
  loadProject(projectPath) {
    console.log(`Loading project from ${projectPath}...`);
    try {
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            this.currentProject = {
                path: projectPath,
                metadata: packageData,
                files: []
            };
            // Scan for files (simplified)
            const files = fs.readdirSync(projectPath).filter(f => f.endsWith('.js') || f.endsWith('.json'));
            this.currentProject.files = files;
            console.log('Project loaded:', this.currentProject);
            return this.currentProject;
        }
    } catch (error) {
        console.error('Failed to load project:', error);
    }
    return null;
  }

  /**
   * Saves the current state of the IDE to disk.
   * @param {object} filesData - Object containing filename: content pairs.
   */
  saveProject(filesData) {
    if (!this.currentProject) return;
    console.log('Saving project...');
    
    try {
        Object.entries(filesData).forEach(([filename, content]) => {
            const fullPath = path.join(this.currentProject.path, filename);
            const fileContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
            fs.writeFileSync(fullPath, fileContent);
            console.log(`Saved ${filename}`);
        });
    } catch (error) {
        console.error('Failed to save project:', error);
    }
  }
}

module.exports = new ProjectManager();
