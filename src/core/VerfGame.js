import Engine from './Engine.js';

/**
 * The main game application class.
 *
 * @memberof module:core~
 */
class VerfGame {
    /**
     * Create a new game application.
     * @param {object} config - A configuration object for controlling the game canvas and declaring scenes, assets and plugins.
     * @param {string} [config.parent=body] - A css selector for the element where the game canvas will be appended.
     * @param {number} [config.width=230] - The width in pixels of the game canvas. If resizable is true, this is the minimum width.
     * @param {number} [config.height=180] - The height in pixels of the game canvas. If resizable is true, this is the minimum height.
     * @param {boolean} [config.resizable=true] - Wether or not the game canvas resizes with the browser window.
     * @param {string|number} [config.zoom=auto] - How many times the canvas will be enlarged or downsized by css. Defaults to 'auto', which does the calculation automatically considering the available space in the browser window.
     * @param {boolean} [config.pixelArt=true] - Wether or not to set `image-rendering: pixelated` on the game canvas. For crisp pixel art.
     * @param {boolean} [config.overlay=false] - Renders the game canvas at the highest z-index with a fixed css position.
     * @param {string} [config.background=transparent] - A color with which the canvas is cleared every frame. You can use hex (#FF0000) or html color names (tomato) Defaults to transparent, meaning you see the body background or anything that is behind the game canvas. Available in the scene through `this.engine.background`
     * @param {string} [config.foreground='#000000'] - An optional foreground color. Available in the scene through `this.engine.foreground`
     * @param {object[]} [config.scenes=[]] - An array with scene configuration objects.
     * @param {string} config.scenes[].name - A unique name you can use to reference the instance of the scene in your code. To start the scene for example.
     * @param {class} config.scenes[].class - The class (extending Scene) that will be used to instantiate the scene.
     * @param {object} [config.scenes[].options] - Extra options that will be available in the scene instance init method.
     * @param {object[]} [config.assets=undefined] - An array with assets to load at the start of the game.
     * @param {string} config.assets[].name - A unique name you can use to reference this asset in your code.
     * @param {string} config.assets[].type - 'image' or 'audio'
     * @param {string} config.assets[].src - The path where the file can be loaded over the network. Can also be a data-uri.
     * @param {object[]} [config.assets[].chunks] - An array for the parts of an audio sprite.
     * @param {number} config.assets[].chunks[].start - Start time of the sound bite in seconds.
     * @param {number} config.assets[].chunks[].end - End time of the sound bite in seconds.
     * @param {object[]} [config.plugins=[]] - An array with plugins.
     * @param {string} config.plugins[].name - A unique name you can use to reference the instance of the plugin in your scene. For example 'sfx' becomes 'this.sfx' in all scenes.
     * @param {string} config.plugins[].type - 'global' or 'scene'. A global plugin doesn't need to extend a class and is the same (singleton) instance for all scenes. For the scene plugins a unique instance is created for each scene and it must extend ScenePlugin.
     * @param {class} config.plugins[].class - The class to instantiate the plugin. It doesn't have to extend anything for the moment.
     * @param {class} [config.plugins[].options] - An object that will be passed to the constructor of the plugin.
     */
    constructor ({
        parent = 'body',
        width = 320,
        height = 180,
        resizable = true,
        zoom = 'auto',
        pixelArt = true,
        overlay = false,
        background = 'transparent',
        foreground = '#000000',
        scenes = [],
        assets = undefined,
        plugins = []
    } = {})
    {
        this.parent = document.querySelector(parent);
        this.canvas = document.createElement('canvas');
        if (pixelArt) {
            this.canvas.style.imageRendering = 'pixelated';
        }
        if (overlay) {
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = 0;
            this.canvas.style.left = 0;
            this.canvas.style.zIndex = 2147483647;
        }
        this.canvas.style.display = 'block';
        this.parent.appendChild(this.canvas);

        this.engine = new Engine(scenes, this.canvas, background, foreground, assets, plugins);

        this.zoom = zoom;
        if (resizable) {
            if (zoom == 'auto') {
                if (width) {
                    this.targetWidth = width;
                }
                if (height) {
                    this.targetHeight = height;
                }
            }
            this.resizeTOID = 0;
            window.addEventListener('resize', () => {
                clearTimeout(this.resizeTOID);
                this.resizeTOID = setTimeout(this.onWindowResize.bind(this), 500);
            });
            this.onWindowResize();

            document.body.style.margin = '0';
            document.body.style.overflow = 'hidden';

        } else {
            if (this.zoom == 'auto') {
                this.zoom = 1;
            }
            this.setSize(width, height, this.zoom);
        }

        this.engine.start();
    }

    /**
     * Internal function. Gets called automatically when the browser window resizes and `resizable` is set to true in the game config.
     * It calculates a width, a height and a zoom depending on the intial values of the game config.
     */
    onWindowResize() {
        let zoom = this.zoom;
        if (zoom == 'auto') {
            let wZoom = Math.max(1, Math.floor(window.innerWidth / ((this.targetWidth) ? this.targetWidth : window.innerWidth)));
            let hZoom = Math.max(1, Math.floor(window.innerHeight / ((this.targetHeight) ? this.targetHeight : window.innerHeight)));
            zoom = Math.min(wZoom, hZoom);
        }
        let w = Math.ceil(window.innerWidth / zoom);
        let h = Math.ceil(window.innerHeight / zoom);
        this.setSize(w, h, zoom);
    }

    /**
     * Internal function. Called by onWindowResize and also at the start of the game.
     * Updates the scene viewport properties and calls the active scene's resize method.
     * @param {number} width - Width for the canvas
     * @param {number} height - Height for the canvas
     * @param {number} zoom - Factor to enlarge or downsize the canvas in css
     */
    setSize(width, height, zoom) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = (width * zoom) + 'px';
        this.canvas.style.height = (height * zoom) + 'px';

        this.engine.scenes.forEach((scene) => {
            scene.viewport.width = width;
            scene.viewport.height = height;
            scene.viewport.zoom = zoom;
            if (scene.active) {
                scene.resize(width, height);
            }
        });
    }
}
export default VerfGame;
