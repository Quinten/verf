import Scene from './Scene.js';
import SimpleBar from '../gameobjects/SimpleBar.js';

class Preloader extends Scene {

    init ()
    {
        this.engine.assets.events.once('queuedone', () => {
            if (this.options.nextScene) {
                this.engine.switchScene(this.options.nextScene);
            }
        });
        this.engine.assets.load(this.options.assets);

        this.bar = new SimpleBar({x: this.viewport.width / 2, y: this.viewport.height / 2});
        this.bar.fillStyle = this.engine.foreground;
        this.add(this.bar);
    }

    update (time, delta)
    {
        this.bar.progress = this.engine.assets.progress;
    }

    shutdown()
    {
        super.shutdown();
        this.bar = undefined;
    }
}
export default Preloader;
