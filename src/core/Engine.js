class Engine {

    constructor (scenes, canvas)
    {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.scenes = [];
        scenes.forEach((scene) => {
            this.scenes.push(new scene());
        });
        this.time = 0;
    }

    start() {
        if (this.scenes[0]) {
            this.scenes[0].setup();
        }
        window.requestAnimationFrame(this.onFrame.bind(this));
    }

    onFrame (time)
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let delta = time - this.time;
        this.time = time;
        if (delta > 200) {
            delta = 200;
        }
        this.scenes.forEach((scene) => {
            if (scene.active) {
                scene.update(time, delta);
            }
        });
        this.scenes.forEach((scene) => {
            if (scene.active) {
                scene.render(this.context);
            }
        });
        window.requestAnimationFrame(this.onFrame.bind(this));
    }
}
export default Engine;
