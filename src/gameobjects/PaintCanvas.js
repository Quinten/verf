import GameObject from './GameObject.js';

class PaintCanvas extends GameObject {

    constructor({
        x = 0,
        y = 0,
        width = 320,
        height = 180,
        pixelArt = true
    } = {})
    {
        super({x, y});
        this.canvas = document.createElement('canvas');
        this.width = this.canvas.width = width;
        this.height = this.canvas.height = height;
        if (pixelArt) {
            this.canvas.style.imageRendering = 'pixelated';
        }
        this.context = this.canvas.getContext('2d');
    }

    draw (context)
    {
        context.drawImage(this.canvas, 0, 0);
    }

    setBounds(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.width = this.canvas.width = w;
        this.height = this.canvas.height = h;
    }
}

export default PaintCanvas;
