import Events from './Events.js';

class Assets {

    constructor ()
    {
        this.events = new Events();
        this.cache = {};
        this.queueLength = 0;
        this.progress = 0;
        this.queueMax = 0;
    }

    load(assets)
    {
        if (!assets.length) {
            return;
        }
        this.progress = 0;
        assets.forEach((asset) => {
            if (this.cache[asset.name]) {
                return;
            }
            this.queueLength++;
            switch (asset.type) {
                case 'image':
                    this.loadImage(asset);
                    break;
                case 'audio':
                    this.loadAudio(asset);
                    break;
            }
        });
        this.queueMax = this.queueLength;
    }

    loadImage(asset) {
        let img = new Image();
        img.onload = (e) => {
            this.cache[asset.name] = img;
            this.queueLength--;
            this.progress = 1 - (this.queueLength / this.queueMax);
            if (this.queueLength === 0) {
                this.events.emit('queuedone');
            }
        };
        img.src = asset.src;
    }

    loadAudio(asset) {
        let audio = new Audio(asset.src);
        audio.addEventListener('loadeddata', (e) => {
            if (asset.chunks) {
                audio.chunks = asset.chunks;
                audio.chunkIndex = -1;
            }
            this.cache[asset.name] = audio;
            this.queueLength--;
            this.progress = 1 - (this.queueLength / this.queueMax);
            if (this.queueLength === 0) {
                this.events.emit('queuedone');
            }
        });
    }

    getByName(name)
    {
        if (this.cache[name]) {
            return this.cache[name];
        }
        return undefined;
    }
}
export default Assets;
