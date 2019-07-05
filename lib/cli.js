const fs = require("fs");
const process = require("process");
const term = require("terminal-kit").terminal;
const FB = require("fb");
const moment = require("moment");
const { searchFb } = require("./functions");
const { readFile, writeFile } = require("./fs");

async function showApps(apps) {
  term.clear();

  term.cyan("Select an app: (Esc = quit)");
  const options = apps.map(app => app.name);
  const response = await term.singleColumnMenu(options, {
    cancelable: true
  }).promise;
  if (response.canceled) {
    process.exit();
  } else {
    await showAccessKeys(apps[response.selectedIndex]);
  }
}

async function showAccessKeys(app) {
  const { appToken, client_id, client_secret, keys } = app;

  let keyInfo = [];

  const progressBar = term.progressBar({
    width: 160,
    title: "Fetching information about the keys:",
    eta: true,
    percent: true
  });

  for (let i = 0; i < keys.length; i++) {
    const row = {};
    const key = keys[i];
    FB.setAccessToken(appToken);
    term.clear();
    const result = await FB.api(`debug_token?input_token=${key}`, {
      client_id,
      client_secret
    });

    if (result.data) {
      FB.setAccessToken(key);

      row.expires = result.data.expires_at
        ? moment.unix(result.data.expires_at).format("DD-MM-YYYY HH:mm")
        : "never";
      row.type = result.data.type;

      const info = await FB.api("/me");
      row.name = info.name;
      row.key = key;
      row.pageId = info.id;
      keyInfo.push(row);
    }

    progressBar.update((i / keys.length) * 100);
  }

  progressBar.stop();

  term.clear();
  term.cyan("Select an access key:  (Esc = quit)");

  const options = keyInfo.map(l => `${l.name}\t(expires: ${l.expires})`);
  const response = await term.singleColumnMenu(options, {
    cancelable: true
  }).promise;
  if (response.canceled) {
    process.exit();
  }

  let obj = {};
  obj.client_id = client_id;
  obj.client_secret = client_secret;
  obj.access_token = keyInfo[response.selectedIndex].key;
  obj.pageId = keyInfo[response.selectedIndex].pageId;

  term.clear();
  term.cyan("Please select the post: (Esc = skip)");
  FB.setAccessToken(obj.access_token);
  const result = await FB.api("/me/posts?limit=10");
  const postOptions = result.data.map(
    l =>
      `${new moment(l.created_time).format("DD-MM-YYYY HH:mm")}\t${
        l.message ? l.message : ""
      }`
  );
  const post = await term.singleColumnMenu(postOptions, {
    cancelable: true
  }).promise;
  if (response.canceled || !post.selectedIndex) {
    term.yellow("Writing this info to .fbToken.");

    await writeFile(`${process.cwd()}/.fbToken`, JSON.stringify(obj));
  } else {
    term.yellow("Writing this info to .fbToken.");
    obj.postId = result.data[post.selectedIndex].id.split("_")[1];
    await writeFile(`${process.cwd()}/.fbToken`, JSON.stringify(obj));
  }
  process.exit();
}

async function go() {
  let location = await searchFb();
  let contents = await readFile(location, "utf-8");
  let json = JSON.parse(contents);

  await showApps(json);
}

exports.accesstokenselector = go;
