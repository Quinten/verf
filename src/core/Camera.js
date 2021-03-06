import ScenePlugin from './ScenePlugin.js';

/**
 * A camera through which the scene is viewed. A camera can be moved around, follow game objects or even be constrained by it's bounds property. It can also perform some juicy effects like shake, flash and fade.
 *
 * @fires module:core~Camera#fadecomplete
 * @fires module:core~Camera#flashcomplete
 * @extends module:core~ScenePlugin
 * @memberof module:core~
 */
class Camera extends ScenePlugin {

    constructor ()
    {
        super();
        /**
         * The mid x position of the camera. At the start of the scene this is set to the center of the scene's viewport. You can also set it yourself in the scene's init and update methods.
         *
         * @type {number}
         */
        this.x = 0;
        /**
         * The mid y position of the camera. At the start of the scene this is set to the center of the scene's viewport. You can also set it yourself in the scene's init and update methods.
         *
         * @type {number}
         */
        this.y = 0;
        /**
         * The game object the camera has to follow. Set to undefined to stop following it.
         *
         * @type {module:gameobjects~GameObject}
         * @default undefined
         */
        this.followTarget = undefined;
        /**
         * A number between 0 and 1 that indicates how much the speed must be smoothed when following a game object. 1 is no smoothing. 0 doesn't change the camera's x position when the game object moves.
         *
         * @type {number}
         * @default 1
         */
        this.lerpX = 1;
        /**
         * Same as lerpX, but along the y axis.
         *
         * @type {number}
         * @default 1
         */
        this.lerpY = 1;

        /**
         * The area that constrains the movement of the camera. If the bounds is undefined it can move anywhere.
         * @type {object}
         * @property {number} x - The left x position of the area relative to the scene's origin.
         * @property {number} y - The top y position of the area relative to the scene's origin.
         * @property {number} width - The width of the area.
         * @property {number} height - The height of the area.
         * @default undefined
         */
        this.bounds = undefined;

        // internal properties
        this.shakeTimer = 0;
        this.shakeIntensity = .02;
        this.fadeTimer = 0;
        this.fadeDuration = 0;
        this.fadeColor = '#000000';
        this.flashTimer = 0;
        this.flashDuration = 0;
        this.flashColor = '#000000';
    }

    /**
     * Automatically called when the scene starts and sets the x and y to the center of the scene's viewport.
     */
    init()
    {
        this.x = this.scene.viewport.width / 2;
        this.y = this.scene.viewport.height / 2;
    }

    /**
     * Automatically called every frame. Updates the camera position if there is a followTarget set. Constrains the movement if a bounds is set. Also applies the shaking effect if there is one going on. Then it updates the scene's offset property.
     *
     * @param {number} time - The total time (in milliesconds) since the start of the game.
     * @param {number} delta - The time elapsed (in milliseconds) since the last frame.
     */
    update(time, delta)
    {
        if (this.followTarget) {
            this.x += (this.followTarget.x - this.x) *  this.lerpX;
            this.y += (this.followTarget.y - this.y) *  this.lerpY;
        }
        let hvpW = this.scene.viewport.width / 2;
        let hvpH = this.scene.viewport.height / 2;
        if (this.bounds) {
            this.x = Math.max(this.x, this.bounds.x + hvpW);
            this.x = Math.min(this.x, this.bounds.x + this.bounds.width - hvpW);
            this.y = Math.max(this.y, this.bounds.y + hvpH);
            this.y = Math.min(this.y, this.bounds.y + this.bounds.height - hvpH);
        }
        let x = this.x - hvpW;
        let y = this.y - hvpH;
        if (this.shakeTimer > 0) {
            this.shakeTimer -= delta;
            x += this.scene.viewport.width * (1 - Math.random() * 2) * this.shakeIntensity;
            y += this.scene.viewport.height * (1 - Math.random() * 2) * this.shakeIntensity;
        }
        this.scene.offset = {x, y};
    }

    /**
     * Automatically called when the scene has rendered it's children. Used for rendering the fade effects.
     *
     * @param {CanvasRenderingContext2D} context - The canvas render context.
     * @param {number} time - The total time (in milliesconds) since the start of the game.
     * @param {number} delta - The time elapsed (in milliseconds) since the last frame.
     */
    postRender (context, time, delta)
    {
        if (this.fadeTimer > 0) {
            this.fadeTimer -= delta;
            context.save();
            context.globalAlpha = Math.min(1, 1 - (this.fadeTimer / this.fadeDuration));
            context.fillStyle = this.fadeColor;
            context.fillRect(0, 0, this.scene.viewport.width, this.scene.viewport.height);
            context.restore();
            if (this.fadeTimer <= 0) {
                /**
                 * Notifies when the camera is done with the fade.
                 *
                 * @event module:core~Camera#fadecomplete
                 */
                this.emit('fadecomplete');
            }
        }
        if (this.flashTimer > 0) {
            context.save();
            context.globalAlpha = Math.max(0, (this.flashTimer / this.flashDuration));
            context.fillStyle = this.flashColor;
            context.fillRect(0, 0, this.scene.viewport.width, this.scene.viewport.height);
            context.restore();
            this.flashTimer -= delta;
            if (this.flashTimer <= 0) {
                /**
                 * Notifies when the camera is done with the flash.
                 *
                 * @event module:core~Camera#flashcomplete
                 */
                this.emit('flashcomplete');
            }
        }
    }

    /**
     * Helper to set the bounds of this camera.
     *
     * @param {number} x - The left x position of the area relative to the scene's origin.
     * @param {number} y - The top y position of the area relative to the scene's origin.
     * @param {number} width - The width of the area.
     * @param {number} height - The height of the area.
     */
    setBounds(x, y, width, height)
    {
        this.bounds = {x, y, width, height};
    }

    /**
     * Shakes the camera. Use in your game logic whenever there is an impact or some other dramatic thing.
     *
     * @param {object} [options] - Optional tweaks to the shake effect.
     * @param {number} [options.duration=300] - How long does the camera need to keep shaking. (In milliseconds)
     * @param {number} [options.intensity=.02] - How much is the screen displaced. This gets multiplied by the scene's viewport size.
     */
    shake({
        duration = 300,
        intensity = .02
    } = {})
    {
        this.shakeTimer = duration;
        this.shakeIntensity = intensity
    }

    /**
     * Fills the whole viewport with a color. From transparency to opaque.
     *
     * @param {object} [options] - Optional tweaks to the fade effect.
     * @param {number} [options.duration=750] - How long the effect takes. (In milliseconds)
     * @param {number} [options.color=#000000] - The color.
     */
    fade({
        duration = 750,
        color = '#000000'
    } = {})
    {
        this.fadeTimer = duration;
        this.fadeDuration = duration;
        this.fadeColor = color;
    }

    /**
     * Fills the whole viewport with a color. From opaque to transparency.
     *
     * @param {object} [options] - Optional tweaks to the fade effect.
     * @param {number} [options.duration=750] - How long the effect takes. (In milliseconds)
     * @param {number} [options.color=#000000] - The color.
     */
    flash({
        duration = 750,
        color = '#000000'
    } = {})
    {
        this.flashTimer = duration;
        this.flashDuration = duration;
        this.flashColor = color;
    }
}
export default Camera;
