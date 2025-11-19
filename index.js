/**
 * Visual Node.js - Entry Point
 * Launches the React Native macOS application.
 */

import { AppRegistry } from 'react-native';
import App from './src/ui/App';
import { name as appName } from './package.json';

AppRegistry.registerComponent(appName, () => App);
