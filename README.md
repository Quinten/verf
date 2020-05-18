# verf

a humble html5 canvas game framework

meant to be modular and extendible

coded for fun and inspired by Flixel and Phaser

## Why anotoher html5 game framework?

Read more about the motivation in [this blogpost](https://supernapie.com/blog/may-2020-update).

## Usage

```
npm i verf
```

```
import {VerfGame} from 'verf';
const game = new VerfGame();
```

For all available exports, see [index.js](https://github.com/Quinten/verf/blob/master/index.js).

The api isn't yet in it's final form as it's still in version 0.x.x

## Examples

You can check out the examples on https://quinten.github.io/verf/examples/

The examples are quite pure. A simple "View source" of the page will show you how to use something.

### Local development server

For the moment there is no webpack-dev-server setup in this repo. But because es6 modules require a server, i test the examples during development with the `server.js` node script in the root of the repository.

The test server runs on http://localhost:4000

I mostly run it in the background until i have to reboot with

```
node server.js > /dev/null &!
```

### Colors

The following colors are used for the examples.

https://coolors.co/75485e-ff5e5b-fcfff7-639fab-4c9f70

## License

MIT
