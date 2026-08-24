const nesting = require('postcss-nesting');
const tailwindcss = require('tailwindcss');
const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    nesting(),
    tailwindcss(),
    postcssPresetEnv({
      stage: 2,
      features: {
        'nesting-rules': false,
      },
      preserve: false,
    }),
    autoprefixer(),
  ],
};
