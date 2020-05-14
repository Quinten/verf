class GameObject {

    constructor ({
        x = 0,
        y = 0
    } = {})
    {
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.scrollFactorX = 1;
        this.scrollFactorY = 1;
        this.width = 32;
        this.height = 32;
        this.fillStyle = '#00FF00';
        this.scene = undefined;
        this.visible = true;
    }

    render (context, offset)
    {
        if (!this.visible) {
            return;
        }
        context.save();
        context.translate(Math.round(this.x - (offset.x * this.scrollFactorX)), Math.round(this.y - (offset.y * this.scrollFactorY)));
        context.rotate(this.rotation);
        this.draw(context);
        context.restore();
    }

    draw (context)
    {
        //if you don't override this method you get a green square
        context.fillStyle = this.fillStyle;
        context.fillRect(-this.width/2, -this.height/2, this.width, this.height);
    }

    destroy()
    {
    }
}
export default GameObject;
