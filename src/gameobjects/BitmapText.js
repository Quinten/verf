import GameObject from './GameObject.js';
import BitmapFontMetrics from './BitmapFontMetrics.js';

/**
 * Renders text by copying parts of a bitmap (usually displaying a font or letters of some sort)
 *
 * @extends module:gameobjects~GameObject
 * @memberof module:gameobjects~
 */
class BitmapText extends GameObject {

    /**
     * @param {object} config - A config object that sets some basic properties.
     * @param {number} [config.x=0] - The game object's x position. See [textAlign]{@link module:gameobjects~BitmapText#textAlign}.
     * @param {number} [config.y=0] - The game object's top y position.
     * @param {string} config.text - The string to use.
     * @param {string} config.font - The name of the image asset.
     * @param {string} [config.textAlign=center] - The alignement of the text. 'left', 'right' or 'center'.
     * @param {module:gameobjects~BitmapFontMetrics} [config.metrics] - A configuration object describing the positions of the characters.
     * @param {string} [config.fillStyle=undefined] - A color to overlay on the opaque areas of the font. If undefined, no coloring is applied.
     */
    constructor ({
        x = 0,
        y = 0,
        text = '',
        font = undefined,
        textAlign = 'center',
        metrics = undefined,
        fillStyle = undefined
    } = {})
    {
        super({x, y});
        this._lines = [];
        this.text = text;
        this.font = font;
        this.textAlign = textAlign;
        this.redraw = true;
        if (metrics) {
            this.metrics = metrics;
        } else {
            this.metrics = new BitmapFontMetrics();
        }
        this.fillStyle = fillStyle;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
    }

    /**
     * The game object's x position. See [textAlign]{@link module:gameobjects~BitmapText#textAlign}.
     *
     * @name module:gameobjects~BitmapText#x
     * @memberof module:gameobjects~BitmapText
     * @type {number}
     */

    /**
     * The game object's top y position.
     *
     * @name module:gameobjects~BitmapText#y
     * @memberof module:gameobjects~BitmapText
     * @type {number}
     */

    /**
     * Draws the text to the screen.
     *
     * @param {CanvasRenderingContext2D} context - The translated canvas context.
     */
    draw (context)
    {
        if (this.font == undefined) {
            return;
        }
        if (this.redraw) {
            this.redraw = false;
            let charWidth = Math.max(...(this._lines.map(str => str.length)));
            this.canvas.width = this.width = charWidth * this.metrics.width;
            this.canvas.height = this.height = this._lines.length * this.metrics.height;
            this.context.clearRect(0, 0, this.width, this.height);
            let x = 0;
            let y = 0;
            this._lines.forEach((line) => {
                let lineOffsetX = 0;
                if (this.textAlign == 'center') {
                    lineOffsetX = (this.width - line.length * this.metrics.width) / 2;
                }
                if (this.textAlign == 'right') {
                    lineOffsetX = this.width - line.length * this.metrics.width;
                }
                line.split('').forEach((char) => {
                    let pos = this.metrics.getCharData(char);
                    let img = this.scene.assets.getByName(this.font);
                    if (img) {
                        let xDest = x * this.metrics.width + lineOffsetX;
                        let yDest = y * this.metrics.height;
                        this.context.drawImage(img, pos.x, pos.y, this.metrics.width, this.metrics.height, xDest, yDest, this.metrics.width, this.metrics.height);
                    }
                    x++;
                });
                x = 0;
                y++;
            });
            if (this.fillStyle) {
                this.context.save();
                this.context.fillStyle = this.fillStyle;
                this.context.globalCompositeOperation = 'source-atop';
                this.context.fillRect(0, 0, this.width, this.height);
                this.context.restore();
            }
        }
        // copy the buffer onto the scene
        let offsetX = 0;
        if (this.textAlign == 'center') {
            offsetX = - this.width / 2;
        }
        if (this.textAlign == 'right') {
            offsetX = - this.width;
        }
        context.drawImage(this.canvas, offsetX, 0);
    }

    /**
     * The string that will be rendered.
     *
     * @type {string}
     */
    get text()
    {
        return this._text;
    }

    set text(text)
    {
        this._text = text;
        this._lines = text.split('\n');
        this.redraw = true;
    }

    /**
     * The alignement of the text. 'left', 'right' or 'center'. If the alignement is 'left', the text is drawn from the x onwards to the left. When the alignement is 'center', x will be in the middle. If the 'aligenment' is right, the text is drawn from x tot the right.
     *
     * @type {string}
     */
    get textAlign()
    {
        return this._textAlign;
    }

    set textAlign(textAlign)
    {
        this._textAlign = textAlign;
        this.redraw = true;
    }
}
export default BitmapText;
