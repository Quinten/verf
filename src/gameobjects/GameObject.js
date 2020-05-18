class GameObject {

    constructor ({
        x = 0,
        y = 0
    } = {})
    {
        this.x = x;
        this.y = y;
        this.scrollFactorX = 1;
        this.scrollFactorY = 1;
        this.width = 32;
        this.height = 32;
        this.fillStyle = '#00FF00';
        this.scene = undefined;
        this.visible = true;
        this.body = undefined;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    addBody(body)
    {
        body.width = this.width;
        body.height = this.height;
        body.x = this.x - body.halfWidth;
        body.y = this.y - body.halfHeight;
        if (this.scene.world) {
           this.scene.world.addBody(body);
        }
        this.body = body;
        return this.body;
    }

    render (context, offset)
    {
        if (!this.visible) {
            return;
        }
        context.save();
        context.translate(Math.round(this.x - (offset.x * this.scrollFactorX)), Math.round(this.y - (offset.y * this.scrollFactorY)));
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
        this.body = undefined;
    }
}
export default GameObject;
