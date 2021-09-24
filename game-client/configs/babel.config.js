const plugins = [
  "@babel/plugin-transform-runtime",
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-function-bind",
];

const config = {
  presets: [
    [
      "@babel/preset-env", {
        useBuiltIns: "usage",
        corejs: "3.18.0",
      }
    ]
  ],
  plugins,
};

module.exports = config;
