class Body {

    constructor ()
    {
        // position
        this.x = 0;
        this.y = 0;
        // size
        this.width = 32;
        this.height = 32;
        // velocity
        this.vx = 0;
        this.vy = 0;

        // gravity
        this.allowGravity = false;
        // displaced by collisions
        this.immovable = true;
        // bouncyness
        this.restitution = 0;
        // bounce of edges
        this.collideWorldBounds = false;
    }

    get width()
    {
        return this._width;
    }

    set width(width)
    {
        this._width = width;
        this.halfWidth = width / 2;
    }

    get height()
    {
        return this._height;
    }

    set height(height)
    {
        this._height = height;
        this.halfHeight = height / 2;
    }

    get midX()
    {
        return this.halfWidth + this.x;
    }

    get midY()
    {
        return this.halfHeight + this.y;
    }

    get top()
    {
        return this.y;
    }

    get left()
    {
        return this.x;
    }

    get right()
    {
        return this.x + this.width;
    }

    get bottom()
    {
        return this.y + this.height;
    }
}
export default Body;
