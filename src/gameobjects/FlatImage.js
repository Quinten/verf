import GameObject from './GameObject.js';

class FlatImage extends GameObject {

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

    draw (context)
    {
        //if you don't override this method you get a green square
        context.fillStyle = this.fillStyle;
        context.fillRect(-this.width/2, -this.height/2, this.width, this.height);
    }

    destroy ()
    {
        this.img = undefined;
    }
}
export default FlatImage;
