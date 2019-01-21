const fs = require("fs");
const { promisify } = require("util");

const access = promisify(fs.access);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

module.exports = { access, readFile, writeFile };
