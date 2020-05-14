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
        if (!this.img) {
            this.img = this.scene.engine.assets.getByName(this.name);
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
    }
}
export default FlatImage;
