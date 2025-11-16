// metro.config.js for React Native 0.82+
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, "jpg", "jpeg", "png"],
    unstable_enablePackageExports: false,
  },
});
