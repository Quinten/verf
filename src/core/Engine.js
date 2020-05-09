class Engine {

    constructor (scenes, canvas, background)
    {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.scenes = [];
        scenes.forEach((scene) => {
            this.scenes.push(new scene());
        });
        this.time = 0;
        this.background = background;
    }

    start() {
        if (this.scenes[0]) {
            this.scenes[0].setup();
        }
        window.requestAnimationFrame(this.onFrame.bind(this));
    }

    onFrame (time)
    {
        let delta = time - this.time;
        this.time = time;
        if (delta > 200) {
            delta = 200;
        }
        if (this.background == 'transparent') {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.context.save();
            this.context.fillStyle = this.background;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.restore();
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
