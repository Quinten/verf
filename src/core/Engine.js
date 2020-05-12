class Engine {

    constructor (scenes, canvas, background)
    {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.scenes = [];
        scenes.forEach((scene) => {
            let newScene = new scene.class();
            newScene.name = scene.name;
            if (scene.options) {
                newScene.options = options;
            }
            newScene.engine = this;
            this.scenes.push(newScene);
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
                scene.render(this.context, time, delta);
            }
        });
        window.requestAnimationFrame(this.onFrame.bind(this));
    }

    switchScene(name) {
        this.scenes.forEach((scene) => {
            if (scene.name == name) {
                if (scene.active) {
                    return;
                }
                scene.setup();
            } else if (scene.active) {
                scene.shutdown();
            }
        });
    }
}
export default Engine;
