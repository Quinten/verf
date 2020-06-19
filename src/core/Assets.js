import Events from './Events.js';

const AudioContext = window.AudioContext || window.webkitAudioContext;

/**
 * Manages loading and caching of assets (images and audio)
 *
 * @fires module:core~Assets#queuedone
 * @extends module:core~Events
 * @memberof module:core~
 */
class Assets extends Events {

    constructor ()
    {
        super();
        /**
         * A dictionary containing all loaded assets.
         *
         * @type {object}
         */
        this.cache = {};
        /**
         * A dictionary containing all audio blobs.
         *
         * @type {object}
         */
        this.blobs = {};
        /**
         * A dictionary containing all audio buffers.
         *
         * @type {object}
         */
        this.audioBuffers = {};
        /**
         * Current number if items waiting to come back from the network.
         *
         * @type {number}
         */
        this.queueLength = 0;
        /**
         * Number between 0 and 1, indicating the progrees of the queue. 1 is complete.
         * .
         * @type {number}
         */
        this.progress = 0;
        /**
         * How many items there where when the queue started.
         * .
         * @type {number}
         */
        this.queueMax = 0;

        if (AudioContext) {
            /**
             * Native AudioContext for encoding loaded audio to audiobuffers. If this is undefined, HTML5 Audio is being used as a fallback.
             * .
             * @type {AudioContext}
             */
            this.audioCtx = new AudioContext();
        }
    }

    /**
     * Starts the loading of assets.
     *
     * @param {object[]} assets - An array of predefined assets.
     * @param {string} assets[].name - A unique name to store it in the [cache]{@link module:core~Assets#cache}. You can also use the name to reference this asset in your code.
     * @param {string} assets[].type - 'image' or 'audio'
     * @param {string} assets[].src - The path where the file can be loaded over the network. Can also be a data-uri.
     * @param {object[]} [assets[].chunks] - An array for the parts of an audio sprite.
     * @param {number} assets[].chunks[].start - Start time of the sound bite in seconds.
     * @param {number} assets[].chunks[].end - End time of the sound bite in seconds.
     */
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
            /**
             * Fired when all assets in the queue are loaded.
             *
             * @event module:core~Assets#queuedone
             */
            this.emit('queuedone');
        }
    }

    /**
     * Get cache item by name.
     *
     * @param {string} - The name you gave the asset.
     * @returns {Image|Audio|undefined}
     */
    getByName(name)
    {
        if (this.cache[name]) {
            return this.cache[name];
        }
        return undefined;
    }

    /**
     * Get blob cache item by name.
     *
     * @param {string} - The name you gave the asset.
     * @returns {DOMString|undefined}
     */
    getBlobByName(name)
    {
        if (this.blobs[name]) {
            return this.blobs[name];
        }
        return undefined;
    }

    /**
     * Get audiobuffer cache item by name.
     *
     * @param {string} - The name you gave the asset.
     * @returns {AudioBuffer|undefined}
     */
    getAudioBufferByName(name)
    {
        if (this.audioBuffers[name]) {
            return this.audioBuffers[name];
        }
        return undefined;
    }
}
export default Assets;
