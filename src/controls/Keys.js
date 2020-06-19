import ScenePlugin from '../core/ScenePlugin.js';

const gamepadMapping = [
    'a', 'b', 'x', 'y',
    false, false, false, false,
    false, false, false, false,
    'up', 'down', 'left', 'right'
];


/**
 * Unified keyboard and gamepad input for desktop games. Puts wasd, cursors and gamepad controls together in a single api.
 * All you need is to check the following properties of this plugin in your scenes update function: up, down, left, right, a, b, x and y.
 *
 * @extends module:core~ScenePlugin
 * @memberof module:controls~
 * @fires module:controls~Keys#keyup
 * @fires module:controls~Keys#keydown
 */
class Keys extends ScenePlugin {

    /**
     * @param {object} options - An options object. Can be passed down with the [game config]{@link module:core~VerfGame}.
     * @param {boolean} [options.wasd=true] - Wether or not to support wasd keys.
     * @param {boolean} [options.cursors=true] - Wether or not to support cursor or arrow keys.
     */
    constructor({
        wasd = true,
        cursors = true
    } = {}) {
        super();
        this.wasd = wasd;
        this.cursors = cursors;
    }

    /**
     * Adds the necessary keyboard and gamepad event listeners at the start of the scene.
     */
    init()
    {
        /**
         * Wether the up cursor, W or Z key or dpad up is currently down.
         * @type {boolean}
         */
        this.up = false; // w + z
        /**
         * Wether the left cursor, A or Q key or dpad left is currently down.
         * @type {boolean}
         */
        this.left = false; // a + q
        /**
         * Wether the down cursor, S key or dpad down is currently down.
         * @type {boolean}
         */
        this.down = false; // s
        /**
         * Wether the right cursor, D key or dpad right is currently down.
         * @type {boolean}
         */
        this.right = false; // d
        /**
         * Wether the space bar or gamepad A button is currently down.
         * @type {boolean}
         */
        this.a = false; // space
        /**
         * Wether the C or B key or gamepad B button is currently down.
         * @type {boolean}
         */
        this.b = false; // c + b
        /**
         * Wether the X key or gamepad X button is currently down.
         * @type {boolean}
         */
        this.x = false; // x
        /**
         * Wether the Y or R key or gamepad Y button is currently down.
         * @type {boolean}
         */
        this.y = false; // r + y

        this.keyDownHandler = this.onKeyDown.bind(this);
        window.addEventListener('keydown', this.keyDownHandler);

        this.keyUpHandler = this.onKeyUp.bind(this);
        window.addEventListener('keyup', this.keyUpHandler);

        this.gamepadConnectedHandler = this.onGamepadConnected.bind(this);
        window.addEventListener('gamepadconnected', this.gamepadConnectedHandler);

        this.gamepadDisconnectedHandler = this.onGamepadDisconnected.bind(this);
        window.addEventListener('gamepaddisconnected', this.gamepadDisconnectedHandler);

        this.gamepad = -1;

        if (this.scene.engine.gamepads.free.length) {
            this.gamepad = this.scene.engine.gamepads.free.shift();
            this.scene.engine.gamepads.occupied.push(this.gamepad);
        }
    }

    /**
     * Called internally when a key goes down. Override this if you want to support more keys.
     *
     * @param {object} e - The native javascript event object.
     */
    onKeyDown(e)
    {
        if (this.gamepad >= 0) {
            return;
        }
        if (this.cursors) {
            switch (e.keyCode) {
                case 38: // up
                    this.up = true;
                    break;
                case 37: // left
                    this.left = true;
                    break;
                case 40: // down
                    this.down = true;
                    break;
                case 39: // right
                    this.right = true;
                    break;
            }
        }
        if (this.wasd) {
            switch (e.keyCode) {
                case 87: // w
                case 90: // z
                    this.up = true;
                    break;
                case 65: // a
                case 81: // q
                    this.left = true;
                    break;
                case 83: // s
                    this.down = true;
                    break;
                case 68: // d
                    this.right = true;
                    break;
            }
        }
        switch (e.keyCode) {
            case 32: // space
                this.a = true;
                break;
            case 67: // c
            case 66: // b
                this.b = true;
                break;
            case 88: // x
                this.x = true;
                break;
            case 89: // y
            case 82: // r
                this.y = true;
                break;
        }
        /**
         * Any key goes down. Passes the native KeyboardEvent.
         *
         * @event module:controls~Keys#keydown
         * @type {KeyboardEvent}
         */
        this.emit('keydown', e);
    }

    /**
     * Called internally when a key goes up. Override this if you want to support more keys.
     *
     * @param {object} e - The native javascript event object.
     */
    onKeyUp(e)
    {
        if (this.cursors) {
            switch (e.keyCode) {
                case 38: // up
                    this.up = false;
                    break;
                case 37: // left
                    this.left = false;
                    break;
                case 40: // down
                    this.down = false;
                    break;
                case 39: // right
                    this.right = false;
                    break;
            }
        }
        if (this.wasd) {
            switch (e.keyCode) {
                case 87: // w
                case 90: // z
                    this.up = false;
                    break;
                case 65: // a
                case 81: // q
                    this.left = false;
                    break;
                case 83: // s
                    this.down = false;
                    break;
                case 68: // d
                    this.right = false;
                    break;
            }
        }
        switch (e.keyCode) {
            case 32: // space
                this.a = false;
                break;
            case 67: // c
            case 66: // b
                this.b = false;
                break;
            case 88: // x
                this.x = false;
                break;
            case 89: // y
            case 82: // r
                this.y = false;
                break;
        }
        /**
         * Any key goes up. Passes the native KeyboardEvent.
         *
         * @event module:controls~Keys#keyup
         * @type {KeyboardEvent}
         */
        this.emit('keyup', e);
    }

    /**
     * Called internally when a gamepad is connected.
     *
     * @param {object} e - The native javascript event object.
     */
    onGamepadConnected(e)
    {
        if (this.gamepad >= 0) {
            return;
        }
        let gamepad = e.gamepad.index;
        if (this.scene.engine.gamepads.occupied.indexOf(gamepad) === -1) {
            this.gamepad = gamepad;
            this.scene.engine.gamepads.occupied.push(this.gamepad);
        }
    }

    /**
     * Called internally when a gamepad is disconnected.
     *
     * @param {object} e - The native javascript event object.
     */
    onGamepadDisconnected(e)
    {
        let gamepad = e.gamepad.index;
        if (gamepad == this.gamepad) {
            this.gamepad = -1;
        }
        let occupiedIndex = this.scene.engine.gamepads.occupied.indexOf(gamepad);
        if (occupiedIndex > -1) {
            this.scene.engine.gamepads.occupied.splice(occupiedIndex, 1);
        }
        let freeIndex = this.scene.engine.gamepads.free.indexOf(gamepad);
        if (freeIndex > -1) {
            this.scene.engine.gamepads.free.splice(freeIndex, 1);
        }
    }

    /**
     * Called internally to update the gamepad mappings. Override this if you want to support more buttons of the gamepad.
     *
     * @param {number} time - The total time (in milliesconds) since the start of the game.
     * @param {number} delta - The time elapsed (in milliseconds) since the last frame.
     */
    update(time, delta)
    {
        if (this.gamepad < 0) {
            return;
        }
        let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        let gamepad = gamepads[this.gamepad];
        gamepad.buttons.forEach((button, index) => {
            if (gamepadMapping[index]) {
                this[gamepadMapping[index]] = button.pressed;
            }
        });
    }

    /**
     * Removes all the keyboard and gamepad event listeners when the scene shuts down.
     */
    shutdown()
    {
        super.shutdown();

        window.removeEventListener('keydown', this.keyDownHandler);
        window.removeEventListener('keyup', this.keyUpHandler);

        window.removeEventListener('gamepadconnected', this.gamepadConnectedHandler);
        window.removeEventListener('gamepaddisconnected', this.gamepadDisconnectedHandler);

        let occupiedIndex = this.scene.engine.gamepads.occupied.indexOf(this.gamepad);
        if (occupiedIndex > -1) {
            this.scene.engine.gamepads.occupied.splice(occupiedIndex, 1);
            this.scene.engine.gamepads.free.push(this.gamepad);
        }
        this.gamepad = -1;

        this.up = false;
        this.left = false;
        this.down = false;
        this.right = false;
        this.a = false;
        this.b = false;
        this.x = false;
        this.y = false;
    }
}
export default Keys;
