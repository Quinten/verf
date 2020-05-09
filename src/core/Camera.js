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
    }

    getOffset()
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
        return {x, y};
    }

    setBounds(x, y, width, height)
    {
        this.bounds = {x, y, width, height};
    }
}
export default Camera;
