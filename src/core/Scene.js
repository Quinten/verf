import Camera from './Camera.js';

class Scene {

    constructor ()
    {
        this.active = false;
        this.viewport = {width: 320, height: 180, zoom: 1};
        this.camera = new Camera();
        this.engine = undefined;
        this.world = undefined;
    }

    setup()
    {
        this.camera.x = this.viewport.width / 2;
        this.camera.y = this.viewport.height / 2;
        this.children = [];
        this.controls = [];

        this.init();
        this.active = true;
    }

    addWorld(world)
    {
        this.world = world;
        return this.world;
    }

    addControls(controls)
    {
        controls.scene = this;
        this.controls.push(controls);
        controls.init();
        return controls;
    }

    add(child)
    {
        child.scene = this;
        this.children.push(child);
        return child;
    }

    remove(child)
    {
        if (this.world && child.body) {
            this.world.removeBody(child.body);
        }
        child.destroy();
        child.scene = undefined;
        this.children.splice(this.children.indexOf(child), 1);
    }

    // overwrite in sub class
    init ()
    {
    }

    // overwrite in sub class
    update (time, delta)
    {
    }

    // overwrite in sub class
    resize(w, h)
    {
    }

    render (context, time, delta)
    {
        if (this.world) {
            this.world.step(delta);
        }

        let toRemove = [];

        let offset = this.camera.getOffset(time, delta);

        this.children.forEach((child) => {

            if (child.lifespan !== undefined) {
                child.lifespan -= delta;
                if (child.lifespan < 0) {
                    toRemove.push(child);
                    return;
                }
            }

            if (child.body) {
                child.x = child.body.midX + child.offsetX;
                child.y = child.body.midY + child.offsetY;
            }

            // cull child
            // check if child is in viewport first
            // left
            if (child.x - child.width / 2 + child.width < offset.x * child.scrollFactorX) {
                return;
            }
            // right
            if (child.x - child.width / 2 > offset.x * child.scrollFactorX + this.viewport.width) {
                return;
            }
            // top
            if (child.y - child.height / 2 + child.height < offset.y * child.scrollFactorY) {
                return;
            }
            // bottom
            if (child.y - child.height / 2 > offset.y * child.scrollFactorY + this.viewport.height) {
                return;
            }
            // all okay render child
            child.render(context, offset);
        });

        toRemove.forEach((child) => {
            this.remove(child);
        });

        this.camera.postRender(context, time, delta);
    }

    restart()
    {
        this.shutdown();
        this.setup();
    }

    shutdown()
    {
        this.children.forEach((child) => {
            child.destroy();
            child.scene = undefined;
        });
        this.children = [];

        this.controls.forEach((controls) => {
            controls.destroy();
            controls.scene = undefined;
        });
        this.controls = [];

        this.camera.events.off();
        this.active = false;

        if (this.world) {
            this.world.destroy();
            this.world = undefined;
        }
    }
}
export default Scene;
