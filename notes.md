# Some notes

This file keeps some notes of useful commands and links i use while developing.

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

and a matching grey color: #495867

### Todo's

- Implement some way to check wether the game loses focus or regains focus. So the game could potentially be paused or restarted.
- Create a function in the sound class that plays a chunk at a certain index.
- Create an example for a custom preloader
- Create an example for spreading the loading of assets.
- Try to create a 2d topdown twinstick shooter. (support for joysticks)
