import Controls from './Controls.js';

class Keys extends Controls {

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
    }

    onKeyDown(e)
    {
        switch (e.keyCode) {
            case 87: // w
            case 90: // z
            case 38: // up
                this.up = true;
                break;
            case 65: // a
            case 81: // q
            case 37: // left
                this.left = true;
                break;
            case 83: // s
            case 40: // down
                this.down = true;
                break;
            case 68: // d
            case 39: // right
                this.right = true;
                break;
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
        switch (e.keyCode) {
            case 87: // w
            case 90: // z
            case 38: // up
                this.up = false;
                break;
            case 65: // a
            case 81: // q
            case 37: // left
                this.left = false;
                break;
            case 83: // s
            case 40: // down
                this.down = false;
                break;
            case 68: // d
            case 39: // right
                this.right = false;
                break;
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

    destroy()
    {
        super.destroy();

        window.removeEventListener('keydown', this.keyDownHandler);
        window.removeEventListener('keyup', this.keyUpHandler);

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
