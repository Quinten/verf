class Scene {

    constructor ()
    {
        this.active = false;
        this.viewport = {width: 320, height: 180, zoom: 1};
    }

    setup()
    {
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

    render (context)
    {
        this.children.forEach((child) => {
            child.render(context);
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
