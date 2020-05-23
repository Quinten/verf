import Assets from './Assets.js';
import Preloader from './Preloader.js';

class Engine {

    constructor (scenes, canvas, background, foreground, startAssets, plugins)
    {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.plugins = [];
        plugins.forEach((plugin) => {
            if (plugin.type == 'global') {
                let newPlugin = new plugin.class(plugin.options);
                newPlugin.name = plugin.name;
                newPlugin.engine = this;
                this.plugins.push(newPlugin);
            }
        });

        this.scenes = [];
        scenes.forEach((scene) => {
            let newScene = new scene.class();
            newScene.name = scene.name;
            if (scene.options) {
                newScene.options = scene.options;
            }
            newScene.engine = this;
            this.plugins.forEach((plugin) => {
                newScene[plugin.name] = plugin;
            });
            this.scenes.push(newScene);
        });
        this.time = 0;
        this.delta = 17;
        this.background = background;
        this.foreground = foreground;

        this.assets = new Assets();
        if (startAssets) {
            this.startAssets = startAssets;
            let preloader = new Preloader();
            preloader.name = 'verfdefaultpreloader';
            preloader.options = {assets: this.startAssets, nextScene: ((this.scenes[0]) ? this.scenes[0].name : undefined)};
            preloader.engine = this;
            this.scenes.unshift(preloader);
        }

        this.timeouts = [];

        // bring focus to the window in an iframe
        window.addEventListener('load', () => {
            window.focus();
            document.body.addEventListener('click', (e) => {
                window.focus();
            }, false);
        });

        this.gamepads = {
            free: [],
            occupied: []
        };
    }

    start() {
        if (this.scenes[0]) {
            this.scenes[0].setup();
        }
        window.requestAnimationFrame(this.onFrame.bind(this));
    }

    onFrame (time)
    {
        let delta = time - this.time;
        this.time = time;
        if (delta > 200) {
            delta = 200;
        }
        this.delta = delta;
        for (let t = this.timeouts.length - 1; t >= 0; t--) {
            if (this.timeouts[t].end <= this.time) {
                this.timeouts[t].callback();
                this.clearTimeout(this.timeouts[t]);
            }
        }
        if (this.background == 'transparent') {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.context.save();
            this.context.fillStyle = this.background;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.restore();
        }
        this.scenes.forEach((scene) => {
            if (scene.active) {
                scene.controls.forEach((control) => {
                    control.update();
                });
                scene.update(time, delta);
            }
        });
        this.scenes.forEach((scene) => {
            if (scene.active) {
                scene.render(this.context, time, delta);
            }
        });
        window.requestAnimationFrame(this.onFrame.bind(this));
    }

    switchScene(name) {
        this.scenes.forEach((scene) => {
            if (scene.name == name) {
                if (scene.active) {
                    return;
                }
                scene.setup();
            } else if (scene.active) {
                scene.shutdown();
            }
        });
    }

    setTimeout(callback, duration)
    {
        let end = this.time + duration;
        let timeout = {callback, end};
        this.timeouts.push(timeout);
        return timeout;
    }

    clearTimeout(timeout)
    {
        this.timeouts.splice(this.timeouts.indexOf(timeout), 1);
    }
}
export default Engine;
