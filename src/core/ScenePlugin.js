import Events from '../core/Events.js';

/**
 * Interface class for scene plugins.
 *
 * @extends module:core~Events
 * @memberof module:core~
 */
class ScenePlugin extends Events {

    /**
     * Called when the scene starts.
     * No need to call `super.init()`
     * @abstract
     */
    init()
    {
    }

    /**
     * Called on each frame if the scene is active. Before all children are rendered.
     * No need to call `super.update(time, delta)`
     *
     * @param {number} time - The total time (in milliesconds) since the start of the game.
     * @param {number} delta - The time elapsed (in milliseconds) since the last frame.
     * @abstract
     */
    update(time, delta)
    {
    }

    /**
     * Called on each frame if the scene is active. After all children are rendered.
     * No need to call `super.postRender(context, time, delta)`
     *
     * @param {CanvasRenderingContext2D} context - The canvas render context.
     * @param {number} time - The total time (in milliesconds) since the start of the game.
     * @param {number} delta - The time elapsed (in milliseconds) since the last frame.
     * @abstract
     */
    postRender (context, time, delta)
    {
    }

    /**
     * Called when the scene is shutdown.
     * Needs to call `super.shutdown()` as well.
     * @abstract
     */
    shutdown()
    {
        this.off();
    }
}
export default ScenePlugin;
