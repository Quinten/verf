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
}
export default Camera;
