import GameObject from './GameObject.js';

/**
 * Renders a spritesheet with multiple frames as animation.
 *
 * @extends module:gameobjects~GameObject
 * @memberof module:gameobjects~
 * @fires module:gameobjects~Sprite#animationstopped
 */
class Sprite extends GameObject {

    /**
     * @param {object} config - A config object that sets some basic properties.
     * @param {number} [config.x=0] - The game object's mid x position.
     * @param {number} [config.y=0] - The game object's mid y position.
     * @param {string} config.name - The name of the image asset to use.
     * @param {number} [config.frame=0] - Which frame to render at the start. Zero indexed.
     * @param {number} [config.width=32] - The width of a single frame.
     * @param {number} [config.height=32] - The height of a single frame.
     */
    constructor ({
        x = 0,
        y = 0,
        name = undefined,
        frame = 0,
        width = 32,
        height = 32
    } = {})
    {
        super({x, y, width, height});
        /**
         * The name of the image asset to use. You can change this to another asset if it has the same layout of frames.
         *
         * @type {string}
         */
        this.name = name;
        /**
         * The index of the frame to render. Zero indexed.
         *
         * @type {number}
         */
        this.frame = frame;
        /**
         * Internal data about the x and y positions of individual frames in the image asset.
         *
         * @type {object[]}
         */
        this.frames = [];
        /**
         * A dictionary with all the animations that have been added to this sprite.
         *
         * @type {object}
         */
        this.animations = {};
    }

    /**
     * Calculates which frame to use and blits it onto the game canvas.
     *
     * @param {CanvasRenderingContext2D} context - The translated game canvas context.
     */
    draw (context)
    {
        if (this.animation) {
            this.tickAnimation();
        }
        if (!this.img) {
            this.img = this.scene.assets.getByName(this.name);
            if (!this.img) {
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

    /**
     * The name if the current aniamtion which is playing. To start an animation, you simple set this property to the name of the desired animation. To stop the current animation and freeze on the current frame, you set this property to `undefined`.
     *
     * @type {string}
     */
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

    /**
     * Adds animation and frame data to this sprite.
     *
     * @param {object} config - A config describing the animation data.
     * @param {string} config.name - A unique name that references the animation. So it can later be triggered.
     * @param {number[]} [config.frames=[0]] - An array with a sequence of frame numbers.
     * @param {number} [config.fps=12] - The framerate of the animation in frames per second.
     * @param {number} [config.loop=-1] - How many times to loop the animation. -1 is loop forever. 0 is don't loop (play it just once). 1 is loop it once (playing it twice), 2 is loop it twice (playing it 3 times) and so on...
     */
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

    /**
     * Internal function that calculates the frame number for the draw method.
     */
    tickAnimation()
    {
        let animation = this.animations[this.animation];
        let frameIndex = Math.floor((animation.time % animation.loopLength) / animation.loopLength * animation.frames.length);
        this.frame = animation.frames[frameIndex];
        animation.time += this.scene.engine.delta;
        if (animation.maxTime > 0) {
            if (animation.time > animation.maxTime) {
                this.animation = undefined;
                /**
                 * Notifies when the current animation has stopped.
                 *
                 * @event module:gameobjects~Sprite#animationstopped
                 */
                this.emit('animationstopped');
            }
        }
    }

    destroy ()
    {
        this.img = undefined;
        super.destroy();
    }
}
export default Sprite;
