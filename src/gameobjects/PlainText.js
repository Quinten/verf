import GameObject from './GameObject.js';

/**
 * Normal text
 *
 * @extends module:gameobjects~GameObject
 * @memberof module:gameobjects~
 */
class PlainText extends GameObject {

    /**
     * @param {object} config - A config object that sets some basic properties.
     * @param {number} [config.x=0] - The game object's x position. See [textAlign]{@link module:gameobjects~PlainText#textAlign}.
     * @param {number} [config.y=0] - The game object's mid y position.
     * @param {string} config.text - The string to use.
     * @param {string} [config.font=16px monospace] - The size and font family.
     * @param {string} [config.textAlign=center] - The alignement of the text. 'left', 'right' or 'center'.
     */
    constructor ({
        x = 0,
        y = 0,
        text = '',
        font = '16px monospace',
        textAlign = 'center'
    } = {})
    {
        super({x, y});
        /**
         * The string that will be rendered.
         *
         * @type {string}
         */
        this.text = text;
        /**
         * The size and font family.
         *
         * @type {string}
         * @default 16px monospace
         */
        this.font = font;
        /**
         * The alignement of the text. 'left', 'right' or 'center'. If the alignement is 'left', the text is drawn from the x onwards to the left. When the alignement is 'center', x will be in the middle. If the 'aligenment' is right, the text is drawn from x tot the right.
         *
         * @type {string}
         */
        this.textAlign = textAlign;
    }

    /**
     * The game object's x position. See [textAlign]{@link module:gameobjects~PlainText#textAlign}.
     *
     * @name module:gameobjects~PlainText#x
     * @memberof module:gameobjects~PlainText
     * @type {number}
     */

    /**
     * Draws the text to the screen.
     *
     * @param {CanvasRenderingContext2D} context - The translated canvas context.
     */
    draw (context)
    {
        context.font = this.font;
        context.textAlign = this.textAlign;
        context.fillStyle = this.fillStyle;
        context.textBaseline = 'middle';
        context.fillText(this.text, 0, 0);
    }
}
export default PlainText;
