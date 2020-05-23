import Controls from './Controls.js';

const gamepadMapping = [
    'a', 'b', 'x', 'y',
    false, false, false, false,
    false, false, false, false,
    'up', 'down', 'left', 'right'
];

class Keys extends Controls {

    constructor({
        wasd = true,
        cursors = true
    } = {}) {
        super();
        this.wasd = wasd;
        this.cursors = cursors;
    }

    init()
    {
        this.up = false; // w + z
        this.left = false; // a + q
        this.down = false; // s
        this.right = false; // d
        this.a = false; // space
        this.b = false; // c + b
        this.x = false; // x
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
    }

    onKeyUp(e)
    {
        if (this.cursors) {
            switch (e.keyCode) {
                case 38: // up
                    this.up = false;
                    //this.emit('upup');
                    break;
                case 37: // left
                    this.left = false;
                    //this.emit('leftup');
                    break;
                case 40: // down
                    this.down = false;
                    //this.emit('downup');
                    break;
                case 39: // right
                    this.right = false;
                    //this.emit('rightup');
                    break;
            }
        }
        if (this.wasd) {
            switch (e.keyCode) {
                case 87: // w
                case 90: // z
                    this.up = false;
                    //this.emit('upup');
                    break;
                case 65: // a
                case 81: // q
                    this.left = false;
                    //this.emit('leftup');
                    break;
                case 83: // s
                    this.down = false;
                    //this.emit('downup');
                    break;
                case 68: // d
                    this.right = false;
                    //this.emit('rightup');
                    break;
            }
        }
        switch (e.keyCode) {
            case 32: // space
                this.a = false;
                this.emit('aup');
                break;
            case 67: // c
            case 66: // b
                this.b = false;
                this.emit('bup');
                break;
            case 88: // x
                this.x = false;
                this.emit('xup');
                break;
            case 89: // y
            case 82: // r
                this.y = false;
                this.emit('yup');
                break;
            case 77: // m
                this.emit('mup');
                break;
            case 27: // esc
                this.emit('escup');
                break;
        }
        this.emit('anyup');
    }

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

    update()
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

    destroy()
    {
        super.destroy();

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
