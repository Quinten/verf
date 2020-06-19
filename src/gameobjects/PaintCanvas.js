import GameObject from './GameObject.js';

/**
 * Uses an offscreen canvas as game object.
 *
 * @extends module:gameobjects~GameObject
 * @memberof module:gameobjects~
 */
class PaintCanvas extends GameObject {

    /**
     * @param {object} config - A config object that sets some basic properties.
     * @param {number} [config.x=0] - The game object's left x position.
     * @param {number} [config.y=0] - The game object's top y position.
     * @param {number} [config.width=320] - The game object's width. Also the width of the internal canvas.
     * @param {number} [config.height=180] - The game object's height. Also the height of the internal canvas.
     * @param {boolean} [config.pixelArt=true] - If set to true this applies a pixelated style to the internal canvas.
     */
    constructor({
        x = 0,
        y = 0,
        width = 320,
        height = 180,
        pixelArt = true
    } = {})
    {
        super({x, y});
        /**
         * A reference to the internal canvas.
         *
         * @type {HTMLCanvasElement}
         */
        this.canvas = document.createElement('canvas');
        this.width = width;
        this.height = height;
        if (pixelArt) {
            this.canvas.style.imageRendering = 'pixelated';
        }
        /**
         * A reference to the 2d context of the internal canvas.
         *
         * @type {CanvasRenderingContext2D}
         */
        this.context = this.canvas.getContext('2d');
    }

    /**
     * The game object's left x position.
     *
     * @name module:gameobjects~PaintCanvas#x
     * @memberof module:gameobjects~PaintCanvas
     * @type {number}
     */

    /**
     * The game object's top y position.
     *
     * @name module:gameobjects~PaintCanvas#y
     * @memberof module:gameobjects~PaintCanvas
     * @type {number}
     */

    /**
     * Draws the internal canvas to the game canvas.
     *
     * @param {CanvasRenderingContext2D} context - The translated game canvas context.
     */
    draw (context)
    {
        context.drawImage(this.canvas, 0, 0);
    }

    set width(width)
    {
        this._width = width;
        if (this.canvas) {
            this.canvas.width = width;
        }
    }

    set height(height)
    {
        this._height = height;
        if (this.canvas) {
            this.canvas.height = height;
        }
    }
}

export default PaintCanvas;
