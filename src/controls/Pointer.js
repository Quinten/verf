import ScenePlugin from '../core/ScenePlugin.js';

/**
 * Unified mouse and touch input.
 *
 * @extends module:core~ScenePlugin
 * @memberof module:controls~
 * @fires module:controls~Pointer#pointerdown
 * @fires module:controls~Pointer#pointermove
 * @fires module:controls~Pointer#pointerup
 */
class Pointer extends ScenePlugin {

    /**
     * Adds the necessary touch and mouse event listeners.
     */
    init()
    {
        let canvas = this.scene.engine.canvas;

        this.mouseDownHandler = this.onMouseDown.bind(this);
        canvas.addEventListener('mousedown', this.mouseDownHandler);

        this.touchStartHandler = this.onTouchStart.bind(this);
        canvas.addEventListener('touchstart', this.touchStartHandler);

        this.mouseMoveHandler = this.onMouseMove.bind(this);
        canvas.addEventListener('mousemove', this.mouseMoveHandler);

        this.touchMoveHandler = this.onTouchMove.bind(this);
        canvas.addEventListener('touchmove', this.touchMoveHandler);

        this.mouseUpHandler = this.onMouseUp.bind(this);
        canvas.addEventListener('mouseup', this.mouseUpHandler);

        this.touchEndHandler = this.onTouchEnd.bind(this);
        canvas.addEventListener('touchend', this.touchEndHandler);

        /**
         * Wether or not the pointer is currently down.
         *
         * @type {boolean}
         */
        this.isDown = false;
    }

    /**
     * Called internally when a the mouse goes down.
     *
     * @param {object} e - The native javascript event object.
     */
    onMouseDown(e)
    {
        this.isDown = true;
        let clientX = e.clientX;
        let clientY = e.clientY;
        let name = 'pointerdown';
        this.emitPointerEvent({name, clientX, clientY});
    }

    /**
     * Called internally when a the finger goes down.
     *
     * @param {object} e - The native javascript event object.
     */
    onTouchStart(e)
    {
        this.isDown = true;
        e.preventDefault();
        let clientX = e.changedTouches[0].clientX;
        let clientY = e.changedTouches[0].clientY;
        let name = 'pointerdown';
        this.emitPointerEvent({name, clientX, clientY});
    }

    /**
     * Called internally when a the mouse moves.
     *
     * @param {object} e - The native javascript event object.
     */
    onMouseMove(e)
    {
        let clientX = e.clientX;
        let clientY = e.clientY;
        let name = 'pointermove';
        this.emitPointerEvent({name, clientX, clientY});
    }

    /**
     * Called internally when a the finger moves.
     *
     * @param {object} e - The native javascript event object.
     */
    onTouchMove(e)
    {
        e.preventDefault();
        let clientX = e.changedTouches[0].clientX;
        let clientY = e.changedTouches[0].clientY;
        let name = 'pointermove';
        this.emitPointerEvent({name, clientX, clientY});
    }

    /**
     * Called internally when the mouse goes up.
     *
     * @param {object} e - The native javascript event object.
     */
    onMouseUp(e)
    {
        this.isDown = false;
        let clientX = e.clientX;
        let clientY = e.clientY;
        this.emitPointerEvent({clientX, clientY});
    }

    /**
     * Called internally when the finger goes up.
     *
     * @param {object} e - The native javascript event object.
     */
    onTouchEnd(e)
    {
        this.isDown = false;
        e.preventDefault();
        let clientX = e.changedTouches[0].clientX;
        let clientY = e.changedTouches[0].clientY;
        this.emitPointerEvent({clientX, clientY});
    }

    /**
     * Calculates the events positions within the game, based on the native mouse or touch position and then emits the event.
     *
     * @param {object} e - An object containing the name of the event to emit and position data of the native event.
     * @param {object} e.name - The name of the event to emit.
     * @param {number} e.clientX - The native events x position relative to the browser window.
     * @param {number} e.clientY - The native events y position relative to the browser window.
     *
     */
    emitPointerEvent({name = 'pointerup', clientX = 0, clientY = 0} = {})
    {
        let rect = this.scene.engine.canvas.getBoundingClientRect();
        let x = (clientX - rect.left);
        let y = (clientY - rect.top);
        let viewportX = x / this.scene.viewport.zoom;
        let viewportY = y / this.scene.viewport.zoom;
        let worldX = viewportX + this.scene.offset.x;
        let worldY = viewportY + this.scene.offset.y;
        /**
         * Pointer down event.
         *
         * @event module:controls~Pointer#pointerdown
         * @type {object}
         * @property {number} viewportX - The x position relative to the top left of the scene's viewport.
         * @property {number} viewportY - The y position relative to the top left of the scene's viewport.
         * @property {number} worldX - The x position relative to the scene's origin.
         * @property {number} worldY - The y position relative to the scene's origin.
         */
        /**
         * Pointer move event. On mobile this event only fires when the pointer is down.
         * This is not the case on desktop. But you can check for the [isDown]{@link module:controls~Pointer#isDown} property
         *
         * @event module:controls~Pointer#pointermove
         * @type {object}
         * @property {number} viewportX - The x position relative to the top left of the scene's viewport.
         * @property {number} viewportY - The y position relative to the top left of the scene's viewport.
         * @property {number} worldX - The x position relative to the scene's origin.
         * @property {number} worldY - The y position relative to the scene's origin.
         */
        /**
         * Pointer up event.
         *
         * @event module:controls~Pointer#pointerup
         * @type {object}
         * @property {number} viewportX - The x position relative to the top left of the scene's viewport.
         * @property {number} viewportY - The y position relative to the top left of the scene's viewport.
         * @property {number} worldX - The x position relative to the scene's origin.
         * @property {number} worldY - The y position relative to the scene's origin.
         */
        this.emit(name, {viewportX, viewportY, worldX, worldY});
    }

    /**
     * Removes all mouse and touch event listeners.
     */
    shutdown()
    {
        super.shutdown();

        let canvas = this.scene.engine.canvas;
        canvas.removeEventListener('mousedown', this.mouseDownHandler);
        canvas.removeEventListener('touchstart', this.touchStartHandler);
        canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        canvas.removeEventListener('touchmove', this.touchMoveHandler);
        canvas.removeEventListener('mouseup', this.mouseUpHandler);
        canvas.removeEventListener('touchend', this.touchEndHandler);

        this.isDown = false;
    }
}
export default Pointer;
