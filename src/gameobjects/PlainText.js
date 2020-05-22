import GameObject from './GameObject.js';

class PlainText extends GameObject {

    constructor ({
        x = 0,
        y = 0,
        text = '',
        font = '16px monospace',
        textAlign = 'center'
    } = {})
    {
        super({x, y});
        this.text = text;
        this.font = font;
        this.textAlign = textAlign;
    }

    draw (context)
    {
        context.font = this.font;
        context.textAlign = this.textAlign;
        context.fillStyle = this.fillStyle;
        context.textBaseline = 'middle';
        context.fillText(this.text, 0, 0);
    }

    destroy ()
    {
    }
}
export default PlainText;
