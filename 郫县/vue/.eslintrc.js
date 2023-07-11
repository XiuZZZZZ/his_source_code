module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  //es5规则
  //extends: 'airbnb-base/legacy',
  //es6+规则
  extends: ['airbnb-base', 'prettier'],
  // required to lint *.vue files
  plugins: ['html'],
  // use document
  globals: {
    document: true,
    // "foo": true,
    // "window": true
  },
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js',
      },
    },
  },
  // add your custom rules here
  rules: {
    'no-restricted-syntax': ['error', 'WithStatement'],
    'func-names': ['error', 'never'],
    'max-len': ['error', 200],
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          markers: ['/'],
          exceptions: ['-', '+'],
        },
        block: {
          markers: ['!'],
          exceptions: ['*'],
          balanced: false,
        },
      },
    ],
    'no-console': [
      'error',
      {
        allow: ['log', 'warn', 'error'],
      },
    ],
    //回车换行不报错,  换行报错
    'linebreak-style': ['error', 'windows'],
    'no-trailing-spaces': 'off',
    'global-require': 'off',
    // don't require .vue extension when importing
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        vue: 'never',
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'import/imports-first': ['warn', 'DISABLE-absolute-first'],
  },
};
