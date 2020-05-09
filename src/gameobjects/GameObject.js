class GameObject {

    constructor ({
        x = 0,
        y = 0
    } = {})
    {
        this.x = x;
        this.y = y;
        this.rotation = 0;
    }

    render (context)
    {
        context.save();
        context.translate(Math.floor(this.x), Math.floor(this.y));
        context.rotate(this.rotation);
        this.draw(context);
        context.restore();
    }

    draw (context)
    {
        //if you don't override this method you get a square
        context.fillRect(-16, -16, 32, 32);
    }

    destroy()
    {
    }
}
export default GameObject;
