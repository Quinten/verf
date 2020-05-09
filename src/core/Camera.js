class Camera {

    constructor ({
        x = 0,
        y = 0
    } = {})
    {
        this.x = x;
        this.y = y;
        this.viewport = {width: 320, height: 180, zoom: 1};
    }

    preUpdate (context)
    {
        let x = this.x - (this.viewport.width / 2);
        let y = this.y - (this.viewport.height / 2);
        return {x, y};
    }
}
export default Camera;
