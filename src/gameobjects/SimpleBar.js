import GameObject from './GameObject.js';

class SimpleBar extends GameObject {

    constructor({
        x = 0,
        y = 0
    } = {}){
        super({x, y});
        this.width = 128;
        this.height = 32;
        this.progress = 0;
    }

    draw (context)
    {
        //progress.lineStyle(2, window.fgColor.color, 1);
        //progress.strokeRect(Math.floor((this.scale.width / 2) - 132), Math.floor((this.scale.height / 2) - 20), 264, 40);
        //progress.fillStyle(window.fgColor.color, 1);
        //progress.fillRect(Math.floor((this.scale.width / 2) - 128), Math.floor((this.scale.height / 2) - 16), 256 * value, 32);
        context.strokeStyle = this.fillStyle;
        context.lineWidth = 2;
        context.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        context.fillStyle = this.fillStyle;
        context.fillRect(-this.width / 2 + 4, -this.height / 2 + 4, Math.floor((this.width - 8) * this.progress), this.height - 8);
    }
}
export default SimpleBar;
