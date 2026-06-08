const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Stub out react-native-worklets entirely.
// Worklets v4 requires New Architecture (Fabric) which Expo Go does not support.
// Without this stub the worklets runtime tries to assign to URL.prototype.protocol
// (a read-only getter in RN 0.81 / Hermes) and crashes before AppRegistry runs.
const originalResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === 'react-native-worklets' ||
    moduleName.startsWith('react-native-worklets/')
  ) {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'src/stubs/worklets-stub.js'),
    };
  }
  if (originalResolve) {
    return originalResolve(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
