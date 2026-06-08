/**
 * react-native-worklets stub for Expo Go (Old Architecture / Paper renderer).
 *
 * Worklets v4 requires New Architecture (Fabric/TurboModules). Expo Go runs
 * on the Old Architecture, so the worklets runtime crashes at startup when it
 * tries to assign to URL.prototype.protocol (a read-only getter in Hermes).
 *
 * Metro's resolveRequest in metro.config.js redirects every import of
 * 'react-native-worklets' here instead, so the native module is never loaded.
 * gesture-handler v2.28 uses worklets only for reanimated animation hooks —
 * core gesture detection remains native and works fine without this runtime.
 */

module.exports = {
  // Core worklet runner stubs — just call the function on the JS thread
  runOnUI: (fn) => fn,
  runOnJS: (fn) => fn,
  isWorklet: () => false,
  makeShareable: (value) => value,
  makeMutable: (value) => ({ value, addListener: () => {}, removeListener: () => {} }),

  // Context / global stubs
  _WORKLET: false,
  _WORKLET_VERSION: '0.0.0-stub',
};
