module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    ['module:react-native-dotenv'],
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-private-methods',
    ['@babel/plugin-transform-private-property-in-object', { loose: true }]
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
  overrides: [
    {
      test: './node_modules/ethers',
      plugins: [
        ['@babel/plugin-transform-private-methods', { loose: true }],
        ['@babel/plugin-transform-private-property-in-object', { loose: true }],
      ],
    },
  ],
}; 