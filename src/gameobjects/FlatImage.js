import GameObject from './GameObject.js';

/**
 * Renders a single image (like a background) without animations.
 *
 * @extends module:gameobjects~GameObject
 * @memberof module:gameobjects~
 */
class FlatImage extends GameObject {

    /**
     * @param {object} config - A config object that sets some basic properties.
     * @param {number} [config.x=0] - The game object's mid x position.
     * @param {number} [config.y=0] - The game object's mid y position.
     * @param {string} config.name - The name of the image asset to use.
     */
    constructor ({
        x = 0,
        y = 0,
        name = undefined
    } = {})
    {
        super({x, y});
        this.name = name;
        this.img = undefined;
    }

    /**
     * Draws the image to the screen.
     *
     * @param {CanvasRenderingContext2D} context - The translated canvas context.
     */
    draw (context)
    {
        if (!this.img) {
            this.img = this.scene.assets.getByName(this.name);
            if (!this.img) {
                this.visible = false;
                return;
            } else {
                this.width = this.img.width;
                this.height = this.img.height;
            }
        }
        context.drawImage(this.img, 0, 0, this.width, this.height, -(this.width / 2), -(this.height / 2), this.width, this.height);
    }

    destroy ()
    {
        this.img = undefined;
        super.destroy();
    }
}
export default FlatImage;
