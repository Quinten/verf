import Events from '../core/Events.js';

/**
 * The base class for all game objects.
 *
 * @extends module:core~Events
 * @memberof module:gameobjects~
 */
class GameObject extends Events {

    /**
     * @param {object} config - A config object that sets some basic properties.
     * @param {number} [config.x=0] - The game object's mid x position.
     * @param {number} [config.y=0] - The game object's mid y position.
     * @param {number} [config.width=32] - The game object's width.
     * @param {number} [config.height=32] - The game object's height.
     */
    constructor ({
        x = 0,
        y = 0,
        width = 32,
        height = 32
    } = {})
    {
        super();
        /**
         * The game object's mid x position.
         * @type {number}
         */
        this.x = x;
        /**
         * The game object's mid y position.
         * @type {number}
         */
        this.y = y;
        /**
         * The game object's width.
         * @type {number}
         */
        this.width = width;
        /**
         * The game object's height.
         * @type {number}
         */
        this.height = height;
        /**
         * A number between 0 and 1. How much the game object is influenced by camera movement along the x axis. 1 means the game object keeps it's position in the scene. 0 means it is static in the viewport.
         * @type {number}
         * @default 1
         */
        this.scrollFactorX = 1;
        /**
         * A number between 0 and 1. How much the game object is influenced by camera movement along the y axis. 1 means the game object keeps it's position in the scene. 0 means it is static in the viewport.
         * @type {number}
         * @default 1
         */
        this.scrollFactorY = 1;
        /**
         * A color to use as fill, when the game object requires a fill.
         *
         * @type {string}
         * @default #000000
         */
        this.fillStyle = '#000000';
        /**
         * A reference to the scene this game object is attached to.
         *
         * @type {module:core~Scene}
         */
        this.scene = undefined;
        /**
         * Wether or not this game object will be rendered.
         *
         * @type {boolean}
         * @default true
         */
        this.visible = true;
        /**
         * A physics body. Use [addBody]{@link module:gameobjects~GameObject#addBody} to attach a body to this game object.
         *
         * @type {module:physics~Body}
         * @default undefined
         */
        this.body = undefined;
        /**
         * How much to displace this game object's x position in relation to the body's x position.
         *
         * @type {number}
         * @default 0
         */
        this.offsetX = 0;
        /**
         * How much to displace this game object's y position in relation to the body's y position.
         *
         * @type {number}
         * @default 0
         */
        this.offsetY = 0;
        /**
         * How long this game object will remain on the scene in millieseconds. Use this for things like particles to let the engine remove them automatically. When it is undefined the game object will remain on the scene until it is removed manually or until the scene shuts down.
         *
         * @type {number}
         * @default undefined
         */
        this.lifespan = undefined;
    }

    get width()
    {
        return this._width;
    }

    set width(width)
    {
        this._width = width;
    }

    get height()
    {
        return this._height;
    }

    set height(height)
    {
        this._height = height;
    }

    /**
     * Adds a physics body to this game object and sets the position, width and height of the physics body to this game object's position, width and height. And returns this game object.
     *
     * @param {module:physics~Body} body - An instance of a physics body
     * @returns {module:gameobjects~GameObject}
     */
    addBody(body)
    {
        body.width = this.width;
        body.height = this.height;
        body.x = this.x - body.halfWidth;
        body.y = this.y - body.halfHeight;
        this.body = body;
        return this;
    }

    /**
     * Called automatically every frame. Translates the canvas 2d context to the position of this game object and calls this game object's [draw]{@link module:gameobjects~GameObject#draw} method. And then restores the context.
     *
     * @param {CanvasRenderingContext2D} context - The canvas render context.
     * @param {object} offset - The scene's offset as manipulated by the camera.
     */
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

    /**
     * Called automatically every frame by this game object's [render]{@link module:gameobjects~GameObject#draw} method. Override this method to control the appearance of your game object and draw shapes and other stuff on the canvas. The context is already translated for you to the game object's position in the scene and camera.
     *
     * @param {CanvasRenderingContext2D} context - The translated canvas context.
     */
    draw (context)
    {
        context.fillStyle = this.fillStyle;
        context.fillRect(-this.width/2, -this.height/2, this.width, this.height);
    }

    /**
     * Automatically called when the scene shuts down to clean up events and references. When you override this method, use `super.destroy()`
     */
    destroy()
    {
        this.body = undefined;
        this.off();
    }
}
export default GameObject;
