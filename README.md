# fbtokenmagic

`fbtokenmagic` is a keychain for Facebook page access tokens.

Developing Facebook integrations can be frustrating. You end up with access keys for staging & productions and it's easy to make mistakes.

With `fbtokenmagic` you can store all of your access keys in one file. The handy CLI will make it easy to select the right one.

The CLI is a wizard which writes an access token, page id and post id to a JSON file.

## Usage

`npm install fbtokenmagic -g` or `yarn global add fbtokenmagic` to install the CLI tool.

To use in your project: `npm install fbtokenmagic --save` or `yarn add fbtokenmagic`

## Configuration

The CLI tool looks for a `.fb.json` file in either your current working directory or your home path. I recommend putting it in your home path so it's accessible for all your projects.

The contents of this file should be:

```
[
  {
    "name": "Your FB app name",
    "client_id": "The client id",
    "client_secret": "The client secret",
    "appToken": "Your app token",
    "keys": [
      "Access key 1",
      "Access key 2"

  }
]
```

You can get your app token [here](https://developers.facebook.com/tools/access_token/).

## Running

In your project directory type `fbtokenmagic`. A wizard will start prompting you to select your app, page and post id. After completing a file called `.fbToken` will be written.

You can either read this by using standard `fs` functions and `JSON.parse` or use the builtin utility method:

```
const fbtokenmagic = require('fbtokenmagic');

const go = async () => {
  const tokenmagic = await fbtokenmagic();
  console.log(tokenmagic);
}

go();

```
