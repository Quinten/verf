class Body {

    static get KINEMATIC() { return 'kinematic'; }
    static get DYNAMIC() { return 'dynamic'; }

    static get DISPLACE() { return 'displace'; }
    static get ELASTIC() { return 'elastic'; }

    constructor ({
        type = Body.DYNAMIC,
        collision = Body.ELASTIC
    } = {})
    {
        this.type = type;
        this.collision = collision;
        this.width = 32;
        this.height = 32;
        // bouncyness
        this.restitution = 0;
        // position
        this.x = 0;
        this.y = 0;
        // velocity
        this.vx = 0;
        this.vy = 0;
        // accelaration
        this.ax = 0;
        this.ay = 0;

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
