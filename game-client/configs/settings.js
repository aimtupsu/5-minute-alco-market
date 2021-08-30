const packageJson = require("../package.json");

const VERSION = packageJson.version;
const SERVER_PORT = packageJson.serverPort;
const MAIN_JS = packageJson.main;

module.exports = {
  VERSION,
  SERVER_PORT,
  MAIN_JS,
};
