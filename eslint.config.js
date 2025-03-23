const config = require('@dtdot/eslint-config');
const reactPlugin = require('eslint-plugin-react');

module.exports = [
  ...config.eslint.configs.react,
  {
    rules: {
      // Place any rule overrides in here
    },
  },
  {
    ignores: [
      'build',
      'dist',
      'eslint.config.*',
      'prettier.config.*',
      'src/generated/*',
      'public',
      'env.schema.js',
      'postcss.config.js',
      'tailwind.config.js',
    ],
  },
  reactPlugin.configs.flat['jsx-runtime'],
];
