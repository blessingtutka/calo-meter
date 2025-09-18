const { withNativeWind } = require('nativewind/metro');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;

config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs', 'json', 'types', '.node'];

config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    sodium: require.resolve('react-native-libsodium'),
};
module.exports = withNativeWind(config, { input: './assets/styles/global.css' });
