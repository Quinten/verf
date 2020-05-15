import Events from '../core/Events.js';
import GameObject from './GameObject.js';

class Sprite extends GameObject {

    constructor ({
        x = 0,
        y = 0,
        name = undefined,
        frame = 0,
        width = 32,
        height = 32
    } = {})
    {
        super({x, y});
        this.name = name;
        this.img = undefined;
        this.frame = frame;
        this.width = width;
        this.height = height;
        this.frames = [];
        this.animations = {};
        this.animation = undefined;
        this.events = new Events();
    }

    draw (context)
    {
        if (this.animation) {
            this.tickAnimation();
        }
        if (!this.img) {
            this.img = this.scene.engine.assets.getByName(this.name);
            if (!this.img) {
                this.visible = false;
                return;
            }
            let x = 0;
            let y = 0;
            this.frames = [];
            while (y < this.img.height) {
                x = 0;
                while (x < this.img.width) {
                    this.frames.push({x, y});
                    x += this.width;
                }
                y += this.height;
            }
        }
        if (this.frames[this.frame]) {
            context.drawImage(this.img, this.frames[this.frame].x, this.frames[this.frame].y, this.width, this.height, -(this.width / 2), -(this.height / 2), this.width, this.height);
        }
    }

    get name() {
        return this._name;
    }

    set name(newName) {
        this._name = newName;
        this.img = undefined;
    }

    get animation() {
        return this._animation;
    }

    set animation(newAnimation) {
        if (newAnimation == this._animation) {
            return;
        }
        this._animation = newAnimation;
        if (this._animation && this.animations[this._animation]) {
            this.animations[this._animation].time = 0;
        }
    }

    addAnimation({
        name = undefined,
        frames = [0],
        fps = 12,
        loop = -1
    } = {})
    {
        if (!name) {
            return;
        }
        let time = 0;
        let rate = 1000 / fps;
        let loopLength = rate * frames.length;
        let maxTime = loopLength * (loop + 1);
        this.animations[name] = {frames, fps, loop, time, maxTime, loopLength};
    }

    tickAnimation()
    {
        let animation = this.animations[this.animation];
        let frameIndex = Math.floor((animation.time % animation.loopLength) / animation.loopLength * animation.frames.length);
        this.frame = animation.frames[frameIndex];
        animation.time += this.scene.engine.delta;
        if (animation.maxTime > 0) {
            if (animation.time > animation.maxTime) {
                this.animation = undefined;
                this.events.emit('animationstopped');
            }
        }
    }

    destroy ()
    {
        this.img = undefined;
        this.events.off();
        this.events = undefined;
    }
}
export default Sprite;
