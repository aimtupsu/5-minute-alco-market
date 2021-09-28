const fs = require("fs");
const path = require("path");
const Koa = require("koa");
const webpack = require("webpack");
const koaWebpack = require("koa-webpack");

const settings = require("../configs/settings");

const webpackConfig = require("../configs/webpack.config.js");
const compiler = webpack(webpackConfig);

const server = new Koa();
const serverPort = settings.SERVER_PORT || 3000;

koaWebpack({
  compiler,
  devMiddleware: {
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
    },
    publicPath: "/",
    stats: {
      colors: true,
    },
  },
}).then((middleware) => {
  server.use(middleware);

  server.use((ctx) => {
    ctx.type = "html";
    ctx.body = fs.readFileSync(path.join(__dirname, "../build/index.html"));
  });

  server.listen(serverPort, () => {
    console.info('Server running at http://localhost:${serverPort}/');
  });
});
