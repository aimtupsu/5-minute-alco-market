const utilities = require("./utilities");

utilities.prepareBuildDir();

utilities.copy("../src/index.html", "../build/index.html");
