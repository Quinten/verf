import GameObject from './GameObject.js';
import BitmapFontMetrics from '../config/BitmapFontMetrics.js';

class BitmapText extends GameObject {

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
                    let img = this.scene.engine.assets.getByName(this.font);
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

    get textAlign()
    {
        return this._textAlign;
    }

    set textAlign(textAlign)
    {
        this._textAlign = textAlign;
        this.redraw = true;
    }

    destroy ()
    {
    }
}
export default BitmapText;
