import Controls from './Controls.js';

class Pointer extends Controls {

    init()
    {
        let canvas = this.scene.engine.canvas;

        this.mouseUpHandler = this.onMouseUp.bind(this);
        canvas.addEventListener('mouseup', this.mouseUpHandler);

        this.touchEndHandler = this.onTouchEnd.bind(this);
        canvas.addEventListener('touchend', this.touchEndHandler);
    }

    onMouseUp(e)
    {
        let clientX = e.clientX;
        let clientY = e.clientY;
        this.emitPointerEvent({clientX, clientY});
    }

    onTouchEnd(e)
    {
        e.preventDefault();
        let clientX = e.changedTouches[0].clientX;
        let clientY = e.changedTouches[0].clientY;
        this.emitPointerEvent({clientX, clientY});
    }

    emitPointerEvent({name = 'pointerup', clientX = 0, clientY = 0} = {})
    {
        let rect = this.scene.engine.canvas.getBoundingClientRect();
        let x = (clientX - rect.left);
        let y = (clientY - rect.top);
        let viewportX = x / this.scene.camera.viewport.zoom;
        let viewportY = y / this.scene.camera.viewport.zoom;
        let worldX = viewportX + this.scene.camera.x - this.scene.camera.viewport.width / 2;
        let worldY = viewportY + this.scene.camera.y - this.scene.camera.viewport.height / 2;
        this.emit(name, {viewportX, viewportY, worldX, worldY});
    }

    destroy()
    {
        super.destroy();

        let canvas = this.scene.engine.canvas;
        canvas.removeEventListener('mouseup', this.mouseUpHandler);
        canvas.removeEventListener('touchend', this.touchEndHandler);
    }
}
export default Pointer;
