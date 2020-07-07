# Verf

a modular and extendible html5 canvas 2d game framework

## Warning

The api is in constant change. Don't use it in production and if you do use it in a project. Use the ~ in the version instead of ^, so it only upgrades the patch version number. The api will still change with minor versions. From 1.0.0 on i will use semantic versioning.

## Usage

```
npm i verf
```

```
import {VerfGame} from 'verf';
const game = new VerfGame(config);
```

See [VerfGame class documentation](https://quinten.github.io/verf/docs/module-core-VerfGame.html) on how to use the config.

## Features

- A state machine with scenes
- A camera object
- An asset loader
- Unified touch and mouse controls
- Unified keyboard and gamepad controls
- A plugin system
- An api for playing back sound files with WebAudio and HTML5 audio fallback
- A simple physics engine
- Sprite animations
- Bitmapfonts and regular text

## Built around the canvas 2d context

This framework is built for games that heavily make use of the canvas 2d context. Mixing the canvas 2d context and webgl is not always good for performance. That's why the decision was made to stick to the canvas 2d context and leverage that instead.

If you are looking for a 2d webgl framework, i recommend [Phaser](https://github.com/photonstorm/phaser).

## Small footprint

Depending on which modules and classes you import the impact on your codebase is 3 to 7 kilobytes when minified and zipped.

## Examples

Check [the examples](https://quinten.github.io/verf/examples/) to learn how to use things.

## Documentation

All modules and classes are [documented](https://quinten.github.io/verf/docs/).

## License

MIT
