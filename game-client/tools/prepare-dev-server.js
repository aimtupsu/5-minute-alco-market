const utilities = require("./utilities");

utilities.clean("../build/");

utilities.copy("../src/index.html", "../build/index.html");
