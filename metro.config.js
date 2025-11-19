const { getDefaultConfig } = require('metro-config');
const path = require('path');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    transformer: {
      babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      sourceExts: ['macos.js', ...sourceExts],
      platforms: ['macos', 'ios', 'android'],
      extraNodeModules: {
        'child_process': path.resolve(__dirname, 'mocks/child_process.js'),
        'fs': path.resolve(__dirname, 'mocks/fs.js'),
        'esbuild': path.resolve(__dirname, 'mocks/esbuild.js'),
        'path': require.resolve('path-browserify'),
        'os': require.resolve('os-browserify/browser'),
        'events': require.resolve('events'),
        'crypto': require.resolve('crypto-browserify'),
        'stream': require.resolve('readable-stream'),
        'buffer': require.resolve('buffer'),
        'tty': require.resolve('tty-browserify'),
        'util': require.resolve('util')
      },
    },
  };
})();
