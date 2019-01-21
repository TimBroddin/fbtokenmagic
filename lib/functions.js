const { cwd } = require("process");
const fs = require("fs");
const { access } = require("./fs");

async function searchFb() {
  let cwdPath = `${cwd()}/.fb.json`;
  let homePath = `${getUserHome()}/.fb.json`;

  let path = (await fileExists(cwdPath))
    ? cwdPath
    : (await fileExists(homePath))
    ? homePath
    : null;
  if (!path) {
    console.error(`Please make your tokens are in ${cwdPath} or ${homePath}`);
    process.exit();
  }

  return path;
}

async function fileExists(file) {
  try {
    await access(file, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

function getUserHome() {
  return process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
}

module.exports = { searchFb, fileExists };
