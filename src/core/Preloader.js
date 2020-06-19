import Scene from './Scene.js';
import SimpleBar from '../gameobjects/SimpleBar.js';

/**
 * The default preloader scene. This scene is instantiated by the engine, when you add your assets with the game config.
 * Can also be extended to create your own preloader graphics.
 *
 * @extends module:core~Scene
 * @memberof module:core~
 */
class Preloader extends Scene {

    /**
     * Starts to load the assets you defined in the game config. And adds a [SimpleBar]{@link module:gameobjects~SimpleBar} to this scene.
     */
    init ()
    {
        this.assets.once('queuedone', () => {
            if (this.options.nextScene) {
                this.engine.switchScene(this.options.nextScene);
            }
        });
        this.assets.load(this.options.assets);

        this.bar = new SimpleBar({x: this.viewport.width / 2, y: this.viewport.height / 2});
        this.bar.fillStyle = this.engine.foreground;
        this.add(this.bar);
    }

    /**
     * Updates the [SimpleBar]{@link module:gameobjects~SimpleBar} graphic.
     *
     * @param {number} time - The total time (in milliesconds) since the start of the game.
     * @param {number} delta - The time elapsed (in milliseconds) since the last frame.
     */
    update (time, delta)
    {
        this.bar.progress = this.assets.progress;
    }

    /**
     * Calls `super.shutdown()` and removes the reference to the [SimpleBar]{@link module:gameobjects~SimpleBar} instance.
     */
    shutdown()
    {
        super.shutdown();
        this.bar = undefined;
    }
}
export default Preloader;
