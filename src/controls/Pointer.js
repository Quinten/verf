import Controls from './Controls.js';

class Pointer extends Controls {

    init()
    {
        let canvas = this.scene.engine.canvas;

        this.mouseDownHandler = this.onMouseDown.bind(this);
        canvas.addEventListener('mousedown', this.mouseDownHandler);

        this.touchStartHandler = this.onTouchStart.bind(this);
        canvas.addEventListener('touchstart', this.touchStartHandler);

        this.mouseMoveHandler = this.onMouseMove.bind(this);
        canvas.addEventListener('mousemove', this.mouseMoveHandler);

        this.touchMoveHandler = this.onTouchMove.bind(this);
        canvas.addEventListener('touchmove', this.touchMoveHandler);

        this.mouseUpHandler = this.onMouseUp.bind(this);
        canvas.addEventListener('mouseup', this.mouseUpHandler);

        this.touchEndHandler = this.onTouchEnd.bind(this);
        canvas.addEventListener('touchend', this.touchEndHandler);

        this.isDown = false;
    }

    onMouseDown(e)
    {
        this.isDown = true;
        let clientX = e.clientX;
        let clientY = e.clientY;
        let name = 'pointerdown';
        this.emitPointerEvent({name, clientX, clientY});
    }

    onTouchStart(e)
    {
        this.isDown = true;
        e.preventDefault();
        let clientX = e.changedTouches[0].clientX;
        let clientY = e.changedTouches[0].clientY;
        let name = 'pointerdown';
        this.emitPointerEvent({name, clientX, clientY});
    }

    onMouseMove(e)
    {
        let clientX = e.clientX;
        let clientY = e.clientY;
        let name = 'pointermove';
        this.emitPointerEvent({name, clientX, clientY});
    }

    onTouchMove(e)
    {
        e.preventDefault();
        let clientX = e.changedTouches[0].clientX;
        let clientY = e.changedTouches[0].clientY;
        let name = 'pointermove';
        this.emitPointerEvent({name, clientX, clientY});
    }

    onMouseUp(e)
    {
        this.isDown = false;
        let clientX = e.clientX;
        let clientY = e.clientY;
        this.emitPointerEvent({clientX, clientY});
    }

    onTouchEnd(e)
    {
        this.isDown = false;
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
        canvas.removeEventListener('mousedown', this.mouseDownHandler);
        canvas.removeEventListener('touchstart', this.touchStartHandler);
        canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        canvas.removeEventListener('touchmove', this.touchMoveHandler);
        canvas.removeEventListener('mouseup', this.mouseUpHandler);
        canvas.removeEventListener('touchend', this.touchEndHandler);

        this.isDown = false;
    }
}
export default Pointer;
