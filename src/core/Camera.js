import Events from './Events.js';

class Camera {

    constructor ({
        x = 0,
        y = 0
    } = {})
    {
        this.x = x;
        this.y = y;
        this.viewport = {width: 320, height: 180, zoom: 1};
        this.followTarget = undefined;
        this.lerpX = 1;
        this.lerpY = 1;
        this.bounds = undefined;
        this.shakeTimer = 0;
        this.shakeIntensity = .02;
        this.events = new Events();
        this.fadeTimer = 0;
        this.fadeDuration = 0;
        this.fadeColor = '#000000';
        this.flashTimer = 0;
        this.flashDuration = 0;
        this.flashColor = '#000000';
    }

    getOffset(time, delta)
    {
        if (this.followTarget) {
            this.x += (this.followTarget.x - this.x) *  this.lerpX;
            this.y += (this.followTarget.y - this.y) *  this.lerpY;
        }
        let hvpW = this.viewport.width / 2;
        let hvpH = this.viewport.height / 2;
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
            x += this.viewport.width * (1 - Math.random() * 2) * this.shakeIntensity;
            y += this.viewport.height * (1 - Math.random() * 2) * this.shakeIntensity;
        }
        return {x, y};
    }

    postRender (context, time, delta)
    {
        if (this.fadeTimer > 0) {
            this.fadeTimer -= delta;
            context.save();
            context.globalAlpha = Math.min(1, 1 - (this.fadeTimer / this.fadeDuration));
            context.fillStyle = this.fadeColor;
            context.fillRect(0, 0, this.viewport.width, this.viewport.height);
            context.restore();
            if (this.fadeTimer <= 0) {
                this.events.emit('fadecomplete');
            }
        }
        if (this.flashTimer > 0) {
            context.save();
            context.globalAlpha = Math.max(0, (this.flashTimer / this.flashDuration));
            context.fillStyle = this.flashColor;
            context.fillRect(0, 0, this.viewport.width, this.viewport.height);
            context.restore();
            this.flashTimer -= delta;
            if (this.flashTimer <= 0) {
                this.events.emit('flashcomplete');
            }
        }
    }

    setBounds(x, y, width, height)
    {
        this.bounds = {x, y, width, height};
    }

    shake({
        duration = 300,
        intensity = .02
    } = {})
    {
        this.shakeTimer = duration;
        this.shakeIntensity = intensity
    }

    fade({
        duration = 750,
        color = '#000000'
    } = {})
    {
        this.fadeTimer = duration;
        this.fadeDuration = duration;
        this.fadeColor = color;
    }

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
