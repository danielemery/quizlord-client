module.exports = {
  env: {
    node: false,
    es6: true,
    mocha: true,
    browser: true,
  },
  extends: ['@dtdot/eslint-config/base'],
  ignorePatterns: [
    'node_modules',
    'dist',
    '.prettierrc.js',
    '.eslintrc.js',
    'public',
    'env.schema.js',
    'postcss.config.js',
    'tailwind.config.js',
  ],
};
