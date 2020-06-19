/**
 * A physics body that can be added to game objects.
 * @memberof module:physics~
 */
class Body {

    constructor ()
    {
        /**
         * The left x position of the body.
         *
         * @type {number}
         */
        this.x = 0;
        /**
         * The top y position of the body.
         *
         * @type {number}
         */
        this.y = 0;
        /**
         * The width of the body.
         *
         * @type {number}
         */
        this.width = 32;
        /**
         * The height of the body.
         *
         * @type {number}
         */
        this.height = 32;
        /**
         * The velocity of the body along the x-axis.
         *
         * @type {number}
         * @default 0
         */
        this.vx = 0;
        /**
         * The velocity of the body along the y-axis.
         *
         * @type {number}
         * @default 0
         */
        this.vy = 0;

        /**
         * Wether the body is influenced by the world's gravitational forces.
         *
         * @type {boolean}
         * @default false
         */
        this.allowGravity = false;
        /**
         * Wether the body is not displaced by collisions.
         *
         * @type {boolean}
         * @default true
         */
        this.immovable = true;
        /**
         * How much other bodies bounce off of this body. 0 means no bounce. 1 means the other bodies velocity is completly reversed.
         *
         * @type {boolean}
         * @default 0
         */
        this.restitution = 0;
        /**
         * Wether this body collides with the world bounds.
         *
         * @type {boolean}
         * @default false
         */
        this.collideWorldBounds = false;
        /**
         * How much of this body's velocity is transferred to colliding bodies along the cross x-axis.
         *
         * @type {number}
         * @default 0
         */
        this.frictionX = 0;
        /**
         * How much of this body's velocity is transferred to colliding bodies along the cross y-axis.
         *
         * @type {number}
         * @default 0
         */
        this.frictionY = 0;
        /**
         * Use this to check wether this body is blocked on certain sides by immovable bodies. {none, top, right, bottom, left}
         *
         * @type {object}
         */
        this.blocked = {none: true, top: false, right: false, bottom: false, left: false};
        /**
         * Use this to check wether this body is touching any movable bodies on certain sides. {none, top, right, bottom, left}
         *
         * @type {object}
         */
        this.touching = {none: true, top: false, right: false, bottom: false, left: false};
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

    /**
     * The mid x position of the body.
     *
     * @type {number}
     */
    get midX()
    {
        return this.halfWidth + this.x;
    }

    /**
     * The mid y position of the body.
     *
     * @type {number}
     */
    get midY()
    {
        return this.halfHeight + this.y;
    }

    /**
     * The top y position of the body.
     *
     * @type {number}
     */
    get top()
    {
        return this.y;
    }

    /**
     * The left x position of the body.
     *
     * @type {number}
     */
    get left()
    {
        return this.x;
    }

    /**
     * The right x position of the body.
     *
     * @type {number}
     */
    get right()
    {
        return this.x + this.width;
    }

    /**
     * The bottom y position of the body.
     *
     * @type {number}
     */
    get bottom()
    {
        return this.y + this.height;
    }
}
export default Body;
