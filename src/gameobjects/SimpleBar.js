import GameObject from './GameObject.js';

/**
 * The default preloader graphic.
 *
 * @extends module:gameobjects~GameObject
 * @memberof module:gameobjects~
 */
class SimpleBar extends GameObject {

    /**
     * @param {object} config - A config object that sets some basic properties.
     * @param {number} [config.x=0] - The bar's mid x position.
     * @param {number} [config.y=0] - The bar's mid y position.
     * @param {number} [config.width=128] - The bar's width.
     * @param {number} [config.height=32] - The bar's height.
     */
    constructor({
        x = 0,
        y = 0,
        width = 128,
        height = 32
    } = {}){
        super({x, y, width, height});
        /**
         * How much of the bar is filled. A number between 0 and 1.
         *
         * @type {number}
         * @default 0
         */
        this.progress = 0;
    }

    /**
     * Draws the bar onto the screen.
     *
     * @param {CanvasRenderingContext2D} context - The translated game canvas context.
     */
    draw (context)
    {
        context.strokeStyle = this.fillStyle;
        context.lineWidth = 2;
        context.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        context.fillStyle = this.fillStyle;
        context.fillRect(-this.width / 2 + 4, -this.height / 2 + 4, Math.floor((this.width - 8) * this.progress), this.height - 8);
    }
}
export default SimpleBar;
