const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { withLibsodiumResolver } = require('@burnt-labs/abstraxion-react-native/metro.libsodium');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;

config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

const xionConfig = withLibsodiumResolver(config);
module.exports = withNativeWind(xionConfig, { input: './assets/styles/global.css' });
