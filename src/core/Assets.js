import Events from './Events.js';

const AudioContext = window.AudioContext || window.webkitAudioContext;

class Assets {

    constructor ()
    {
        this.events = new Events();
        this.cache = {};
        this.blobs = {};
        this.audioBuffers = {};
        this.queueLength = 0;
        this.progress = 0;
        this.queueMax = 0;
        if (AudioContext) {
            this.audioCtx = new AudioContext();
        }
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
            this.updateProgress();
        };
        img.src = asset.src;
    }

    loadAudio(asset) {
        if (this.audioCtx) {
            fetch(asset.src).then((response) => {
                return response.arrayBuffer();
            }).then((arrayBuffer) => {
                this.audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
                    if (asset.chunks) {
                        audioBuffer.chunks = asset.chunks;
                        audioBuffer.chunkIndex = -1;
                    }
                    this.audioBuffers[asset.name] = audioBuffer;
                    this.updateProgress();
                });
            });
        } else {
            fetch(asset.src).then((response) => {
                return response.blob();
            }).then((blob) => {
                let fileBlob = URL.createObjectURL(blob);
                let audio = new Audio(fileBlob);
                if (asset.chunks) {
                    audio.chunks = asset.chunks;
                    audio.chunkIndex = -1;
                }
                this.cache[asset.name] = audio;
                this.blobs[asset.name] = fileBlob;
                this.updateProgress();
            });
        }
    }

    updateProgress()
    {
        this.queueLength--;
        this.progress = 1 - (this.queueLength / this.queueMax);
        if (this.queueLength === 0) {
            this.events.emit('queuedone');
        }
    }

    getByName(name)
    {
        if (this.cache[name]) {
            return this.cache[name];
        }
        return undefined;
    }

    getBlobByName(name)
    {
        if (this.blobs[name]) {
            return this.blobs[name];
        }
        return undefined;
    }

    getAudioBufferByName(name)
    {
        if (this.audioBuffers[name]) {
            return this.audioBuffers[name];
        }
        return undefined;
    }
}
export default Assets;
