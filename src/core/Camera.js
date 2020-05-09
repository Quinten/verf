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
    }

    getOffset()
    {
        if (this.followTarget) {
            this.x += (this.followTarget.x - this.x) *  this.lerpX;
            this.y += (this.followTarget.y - this.y) *  this.lerpY;
        }
        let x = this.x - (this.viewport.width / 2);
        let y = this.y - (this.viewport.height / 2);
        return {x, y};
    }
}
export default Camera;
