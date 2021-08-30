const plugins = [
  "@babel/plugin-transform-runtime",
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-function-bind",
];

const config = {
  presets: ["@babel/preset-env"],
  plugins,
};

module.exports = config;
