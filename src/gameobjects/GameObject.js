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
    }

    render (context, offset)
    {
        context.save();
        context.translate(Math.round(this.x - (offset.x * this.scrollFactorX)), Math.round(this.y - (offset.y * this.scrollFactorY)));
        context.rotate(this.rotation);
        this.draw(context);
        context.restore();
    }

    draw (context)
    {
        //if you don't override this method you get a square
        context.fillStyle = "#00FF00";
        context.fillRect(-16, -16, 32, 32);
    }

    destroy()
    {
    }
}
export default GameObject;
