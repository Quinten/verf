class Scene {

    constructor ()
    {
        this.active = false;
    }

    setup()
    {
        this.children = [];
        this.init();
        this.active = true;
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
