import Engine from './core/Engine.js';

class VerfGame {

    constructor ({
        parent = 'body',
        width = 320,
        height = 180,
        resizable = true,
        zoom = 'auto',
        pixelArt = true,
        scenes = []
    } = {})
    {
        this.parent = document.querySelector(parent);
        this.canvas = document.createElement('canvas');
        if (pixelArt) {
            this.canvas.style.imageRendering = 'pixelated';
        }
        this.canvas.style.display = 'block';
        this.parent.appendChild(this.canvas);
        this.zoom = zoom;

        if (resizable) {
            if (zoom == 'auto') {
                if (width) {
                    this.targetWidth = width;
                }
                if (height) {
                    this.targetHeight = height;
                }
            }
            this.resizeTOID = 0;
            window.addEventListener('resize', this.onWindowResize.bind(this));
            this.onWindowResize();

            document.body.style.margin = '0';
            document.body.style.overflow = 'hidden';

        } else {
            if (this.zoom == 'auto') {
                this.zoom = 1;
            }
            this.setSize(width, height, this.zoom);
        }

        this.engine = new Engine(scenes, this.canvas);
    }

    onWindowResize() {
        clearTimeout(this.resizeTOID);
        this.resizeTOID = setTimeout(() => {
            let zoom = this.zoom;
            if (zoom == 'auto') {
                let wZoom = Math.max(1, Math.floor(window.innerWidth / ((this.targetWidth) ? this.targetWidth : window.innerWidth)));
                let hZoom = Math.max(1, Math.floor(window.innerHeight / ((this.targetHeight) ? this.targetHeight : window.innerHeight)));
                zoom = Math.min(wZoom, hZoom);
            }
            let w = Math.ceil(window.innerWidth / zoom);
            let h = Math.ceil(window.innerHeight / zoom);
            this.setSize(w, h, zoom);
        }, 500);
    }

    setSize(width, height, zoom) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = (width * zoom) + 'px';
        this.canvas.style.height = (height * zoom) + 'px';

        // TODO: apply width and height to cameras and scene
    }
}
export default VerfGame;
