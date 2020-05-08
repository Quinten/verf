class GameObject {

    constructor ()
    {
        this.x = 100;
        this.y = 100;
        this.rotation = 0;
    }

    render (context)
    {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.fillRect(-16, -16, 32, 32);
        context.restore();
    }

    destroy()
    {
    }
}
export default GameObject;
