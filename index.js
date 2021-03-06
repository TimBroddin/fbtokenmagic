const fs = require("fs");
const { fileExists } = require("./lib/functions");
const { readFile } = require("./lib/fs");
const { cwd } = require("process");
async function getFbToken() {
  let path = `${cwd()}/.fbToken`;

  if (await fileExists(path)) {
    let contents = await readFile(path, "utf-8");
    return JSON.parse(contents);
  } else if (process.env.FB_TOKEN_MAGIC) {
    return JSON.parse(process.env.FB_TOKEN_MAGIC);
  } else {
    throw new Error(`No .fbToken file present at ${path}`);
  }
}

module.exports = getFbToken;
