import Assets from './Assets.js';
import Preloader from './Preloader.js';
import Camera from './Camera.js';

/**
 * Manages the scenes and plugins. It is also responsible for all things concerning timing and the animation frame.
 *
 * @memberof module:core~
 */
class Engine {

    constructor (scenes, canvas, background, foreground, startAssets, plugins)
    {
        /**
         * A reference to the canvas element.
         *
         * @type {HTMLCanvasElement}
         */
        this.canvas = canvas;
        /**
         * A reference to the 2d context of the canvas.
         *
         * @type {CanvasRenderingContext2D}
         */
        this.context = canvas.getContext('2d');

        /**
         * A reference to the global Assets plugin.
         * @name module:core~Engine#assets
         * @memberof module:core~Engine
         * @type {module:core~Assets}
         */
        /**
         * A reference to the global Assets plugin.
         * @name module:core~Scene#assets
         * @memberof module:core~Scene
         * @type {module:core~Assets}
         */
        plugins.push({name: 'assets', type: 'global', class: Assets});

        /**
         * The camera object that belongs to this scene.
         * @name module:core~Scene#camera
         * @memberof module:core~Scene
         * @type {module:core~Camera}
         */
        plugins.push({name: 'camera', type: 'scene', class: Camera});

        /**
         * An array of instantiated global plugins.
         *
         * @type {object[]}
         */
        this.plugins = [];
        plugins.forEach((plugin) => {
            if (plugin.type == 'global') {
                let newPlugin = new plugin.class(plugin.options);
                newPlugin.name = plugin.name;
                this[plugin.name] = newPlugin;
                /**
                 * A reference to the main engine.
                 * @name module:core~Assets#engine
                 * @memberof module:core~Assets
                 * @type {module:core~Engine}
                 */
                newPlugin.engine = this;
                this.plugins.push(newPlugin);
            }
        });

        if (startAssets) {
            scenes.unshift({name: 'verfdefaultpreloader', class: Preloader, options: {assets: startAssets, nextScene: ((scenes[0]) ? scenes[0].name : undefined)}});
        }

        /**
         * An array of all the instantiated scenes.
         *
         * @type {module:core~Scene[]}
         */
        this.scenes = [];
        scenes.forEach((scene) => {
            let newScene = new scene.class();
            /**
             * The name you gave this instance of the scene in the game config.
             * @name module:core~Scene#name
             * @memberof module:core~Scene
             * @type {string}
             */
            newScene.name = scene.name;
            if (scene.options) {
                /**
                 * An object that is taken from the game config and passed to a specific scene that was instantiated by the Engine. This way you can use the same scene class, but have multiple instances with different things going on. Available in the init function of the scene, but not in the constructor.
                 * @name module:core~Scene#options
                 * @memberof module:core~Scene
                 * @type {object}
                 */
                newScene.options = scene.options;
            }

            /**
             * A reference to the main engine.
             * @name module:core~Scene#engine
             * @memberof module:core~Scene
             * @type {module:core~Engine}
             */
            newScene.engine = this;

            this.plugins.forEach((plugin) => {
                newScene[plugin.name] = plugin;
            });
            plugins.forEach((plugin) => {
                if (plugin.type == 'scene') {
                    let newPlugin = new plugin.class(plugin.options);
                    /**
                     * The name you gave this instance of the ScenePlugin in the game config. If you gave the plugin the name `whiskymixer`, it will become available in the scene as property like in `this.whiskymixer`.
                     * @name module:core~ScenePlugin#name
                     * @memberof module:core~ScenePlugin
                     * @type {string}
                     */
                    newPlugin.name = plugin.name;
                    /**
                     * A reference to the main engine.
                     * @name module:core~ScenePlugin#engine
                     * @memberof module:core~ScenePlugin
                     * @type {module:core~Engine}
                     */
                    newPlugin.engine = this;
                    /**
                     * A reference to the scene where this plugin is active.
                     * @name module:core~ScenePlugin#scene
                     * @memberof module:core~ScenePlugin
                     * @type {module:core~Scene}
                     */
                    newPlugin.scene = newScene;
                    newScene[plugin.name] = newPlugin;
                    newScene.plugins.push(newPlugin);
                }
            });
            this.scenes.push(newScene);
        });

        /**
         * The total time the game has been running in millieseconds. However if the browser window is not active (no frames are updated) then this value is not incremented.
         *
         * @type {number}
         */
        this.time = 0;
        /**
         * The time elapsed since the last frame.
         *
         * @type {number}
         */
        this.delta = 17;
        /**
         * The background color of the game for example '#f45a75' or 'tomato'. Can also be set to 'transparent'.
         *
         * @type {string}
         */
        this.background = background;
        /**
         * The foreground color. Not used much. But can be handy if you are making a 2 color game.
         *
         * @type {string}
         */
        this.foreground = foreground;

        /**
         * An array keeping track of the setTimeout callbacks.
         *
         * @type {object[]}
         */
        this.timeouts = [];

        // bring focus to the window in an iframe
        window.addEventListener('load', () => {
            window.focus();
            document.body.addEventListener('click', (e) => {
                window.focus();
            }, false);
        });
    }

    /**
     * Called by VerfGame instance to kick things off and start the first scene (the one you defined first in your game config).
     */
    start() {
        if (this.scenes[0]) {
            this.scenes[0].setup();
        }
        window.requestAnimationFrame(this.onFrame.bind(this));
    }

    /**
     * This method handles the browser's requestAnimationFrame and then calls all other update, render, draw and whatever functions in the system that need to run every frame.
     */
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
                scene.plugins.forEach((plugin) => {
                    plugin.update(time, delta);
                });
                scene.update(time, delta);
            }
        });
        this.scenes.forEach((scene) => {
            if (scene.active) {
                scene.render(this.context, time, delta);
                scene.plugins.forEach((plugin) => {
                    plugin.postRender(this.context, time, delta);
                });
            }
        });
        window.requestAnimationFrame(this.onFrame.bind(this));
    }

    /**
     * Stops the current scene and starts the scene with the given name. Does nothing if the scene is already active. To restart the current scene use the scene's restart method.
     *
     * @param {string} name - The name of the scene instance as defined by you in the game config.
     */
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

    /**
     * Works the same way as the native javascript setTimeout, but with the main difference that if the gameloop pauses (happens when the browser window becomes invisble) the callback is not executed, but the timer is paused and then resumed when the gameloop starts again.
     *
     * @param {function} callback - The callback to be executed.
     * @param {number} duration - How many millisceonds to wait before the callback gets executed.
     * @returns {object} The timeout object. You can store this in a variable and then pass it to the clearTimeout function if you want to cancel the timeout.
     */
    setTimeout(callback, duration)
    {
        let end = this.time + duration;
        let timeout = {callback, end};
        this.timeouts.push(timeout);
        return timeout;
    }

    /**
     * Use this to cancel the timeouts created by the setTimeout method.
     *
     * @param {object} timeout - The object returned by setTimeout method.
     */
    clearTimeout(timeout)
    {
        this.timeouts.splice(this.timeouts.indexOf(timeout), 1);
    }
}
export default Engine;
