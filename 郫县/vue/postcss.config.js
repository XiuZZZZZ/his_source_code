// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  // parser: 'sugarss',
  plugins: {
    'postcss-import': {},
    'postcss-bem': {
      defaultNamespace: undefined, // default namespace to use, none by default
      style: 'suit', // suit or bem, suit by default,
      separators: {
        descendent: '__', // overwrite any default separator for chosen style
        modifier: '--'
      },
      shortcuts: {
        component: 'b',
        descendent: 'e',
        modifier: 'm',
      }
    },
    'postcss-cssnext': {},
    'cssnano': { zindex: false }
  }
}
