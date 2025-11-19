/**
 * Visual Node.js - Entry Point
 * Launches the React Native macOS application.
 */

// Polyfill for crypto and other Node.js modules
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { AppRegistry } from 'react-native';
import App from './src/ui/App';
import { name as appName } from './package.json';

AppRegistry.registerComponent(appName, () => App);
