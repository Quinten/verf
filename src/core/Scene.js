import Camera from './Camera.js';

class Scene {

    constructor ()
    {
        this.active = false;
        this.viewport = {width: 320, height: 180, zoom: 1};
        this.camera = new Camera();
    }

    setup()
    {
        this.camera.x = this.viewport.width / 2;
        this.camera.y = this.viewport.height / 2;
        this.children = [];
        this.init();
        this.active = true;
    }

    add(child)
    {
        this.children.push(child);
    }

    remove(child)
    {
        this.children.splice(this.children.indexOf(child), 1);
    }

    // called by sub class
    init ()
    {
    }

    // called by sub class
    update (time, delta)
    {
    }

    render (context, time, delta)
    {
        let offset = this.camera.getOffset(time, delta);
        this.children.forEach((child) => {
            // cull child
            // check if child is in viewport first
            // left
            if (child.x + child.width < offset.x * child.scrollFactorX) {
                return;
            }
            // right
            if (child.x > offset.x * child.scrollFactorX + this.viewport.width) {
                return;
            }
            // top
            if (child.y + child.height < offset.y * child.scrollFactorY) {
                return;
            }
            // bottom
            if (child.y > offset.y * child.scrollFactorY + this.viewport.height) {
                return;
            }
            // all okay render child
            child.render(context, offset);
        });
    }

    resize(w, h)
    {
    }

    destroy()
    {
        this.children = [];
        this.active = false;
    }
}
export default Scene;
