const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')([
  'react-native',
  'react-native-web',
  '@react-navigation/native',
  '@react-navigation/stack',
  '@react-navigation/bottom-tabs',
  'react-native-safe-area-context',
  'react-native-vector-icons',
  'react-native-elements',
  '@rneui/base',
  '@rneui/themed',
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    return config;
  },
  transpilePackages: [
    'react-native',
    'react-native-web',
    '@react-navigation/native',
    '@react-navigation/stack',
    'react-native-safe-area-context',
    'react-native-vector-icons',
  ],
};

module.exports = withPlugins([withTM], nextConfig); 