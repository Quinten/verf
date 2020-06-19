import Events from './Events.js';

/**
 * Base Class for scenes that holds game objects and renders them.
 *
 * @extends module:core~Events
 * @memberof module:core~
 * @fires module:core~Scene#addedchild
 * @fires module:core~Scene#removedchild
 */
class Scene extends Events {

    constructor ()
    {
        super();

        /**
         * Wether or not this scene is the active scene and it is being rendered. Best not to set directly. Use [engine.switchScene]{@link module:core~Engine#switchScene} instead.
         * @type {boolean}
         * @default false
         */
        this.active = false;

        /**
         * Information about the actual size of the viewport and canvas.
         * @type {object}
         * @property {number} width - The actual width of the viewport or canvas. Not the one set in the game config.
         * @property {number} height - The actual height of the viewport or canvas. Not the one set in the game config.
         * @property {number} zoom - The actual zoom. Not the one set in the game config.
         */
        this.viewport = {width: 320, height: 180, zoom: 1};

        /**
         * An array that holds the scene plugins.
         * @type {module:core~ScenePlugin[]}
         */
        this.plugins = [];

        this.offset = {x: 0, y: 0};
    }

    /**
     * Internal function for starting the scene again. Use `init` to do your own setup.
     */
    setup()
    {
        this.plugins.forEach((plugin) => {
            plugin.init();
        });

        /**
         * The children that are added to the scene. Children will be rendered on top of each other. So a child with a lower index will be behind children with a higher index.
         * @type {module:gameobjects~GameObject[]}
         */
        this.children = [];

        this.init();
        this.active = true;
    }

    /**
     * Adds a child to this scene.
     * @param {module:gameobjects~GameObject} - The GameObject instance to be added.
     * @returns {module:gameobjects~GameObject} - Returns the child again.
     */
    add(child)
    {
        child.scene = this;
        this.children.push(child);
        /**
         * Notifies when a child is added to this scene. Passes the child that was added.
         *
         * @event module:core~Scene#addedchild
         * @type {module:gameobjects~GameObject}
         */
        this.emit('addedchild', child);
        return child;
    }

    /**
     * Removes a child from this scene. If the child has a body, the body will be removed from the world.
     * @param {module:gameobjects~GameObject} - The GameObject to be removed.
     */
    remove(child)
    {
        /**
         * Notifies when a child is removed from this scene. Passes the child that was removed.
         *
         * @event module:core~Scene#removedchild
         * @type {module:gameobjects~GameObject}
         */
        this.emit('removedchild', child);
        child.scene = undefined;
        this.children.splice(this.children.indexOf(child), 1);
    }

    /**
     * Automatically called when the scene starts again. Can be used in your own Scene classes to setup the scene. No need to call `super.init()`.
     * @abstract
     */
    init ()
    {
    }

    /**
     * Automatically called every frame. Can be used in your own Scene classes to do game logic. No need to call `super.update()`.
     * @abstract
     * @param {number} time - The total time (in milliesconds) since the start of the game.
     * @param {number} delta - The time elapsed (in milliseconds) since the last frame.
     */
    update (time, delta)
    {
    }

    /**
     * Automatically called when the browser resizes. Can be used in your own Scene classes to resposition stuff. No need to call `super.resize()`.
     * @abstract
     * @param {number} w - The new width of the game canvas.
     * @param {number} h - The new height of the game canvas.
     */
    resize(w, h)
    {
    }

    /**
     * Internal function. Automatically called every frame. Can be overriden, but it is best to call `super.render(context, time, delta)`. Using `update` is the preferred way to go to game logic.
     * @param {CanvasRenderingContext2D} context - The canvas render context.
     * @param {number} time - The total time (in milliesconds) since the start of the game.
     * @param {number} delta - The time elapsed (in milliseconds) since the last frame.
     */
    render (context, time, delta)
    {
        let toRemove = [];

        this.children.forEach((child) => {

            if (child.lifespan !== undefined) {
                child.lifespan -= delta;
                if (child.lifespan < 0) {
                    toRemove.push(child);
                    return;
                }
            }

            if (child.body) {
                child.x = child.body.midX + child.offsetX;
                child.y = child.body.midY + child.offsetY;
            }

            // cull child
            // check if child is in viewport first
            // left
            if (child.x - child.width / 2 + child.width < this.offset.x * child.scrollFactorX) {
                return;
            }
            // right
            if (child.x - child.width / 2 > this.offset.x * child.scrollFactorX + this.viewport.width) {
                return;
            }
            // top
            if (child.y - child.height / 2 + child.height < this.offset.y * child.scrollFactorY) {
                return;
            }
            // bottom
            if (child.y - child.height / 2 > this.offset.y * child.scrollFactorY + this.viewport.height) {
                return;
            }
            // all okay render child
            child.render(context, this.offset);
        });

        toRemove.forEach((child) => {
            this.remove(child);
        });
    }

    /**
     * Simply restart this scene.
     */
    restart()
    {
        this.shutdown();
        this.setup();
    }

    /**
     * Internal function for stopping the scene and removing everything. Can be overridden, but you must call `super.shutdown()` or it can lead to pretty bad erros and memory leaks.
     */
    shutdown()
    {
        this.children.forEach((child) => {
            child.destroy();
            child.scene = undefined;
        });
        this.children = [];

        this.plugins.forEach((plugin) => {
            plugin.shutdown();
        });

        this.active = false;
        this.off();
    }
}
export default Scene;
