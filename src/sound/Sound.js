/**
 * Global plugin for playing back audio from files.
 * @memberof module:sound~
 */
class Sound {

    /**
     * @param options - An options object for this plugin. Passed via the game config.
     * @param options.key - The key to use for localStorage. Used to store wether this plugin is muted or not.
     */
    constructor ({
        key = 'verf-sound'
    } = {})
    {
        this.key = key;
        this._isOn = true;
        let savedSetting = localStorage.getItem(this.key);
        if (savedSetting === 'off') {
            this._isOn = false;
        }
        this.tracks = {};
    }

    /**
     * Wether this sound plugin is active or on (not muted).
     *
     * @type {boolean}
     * @default true
     */
    get isOn() {
        return this._isOn;
    }

    set isOn(value) {
        this._isOn = value;
        localStorage.setItem(this.key, (value) ? 'on' : 'off');
    }

    createAndStartBufferSource({
        audioBuffer = undefined,
        start = 0,
        duration = undefined,
        name = '',
        loop = false
    }= {})
    {
        if (audioBuffer == undefined) {
            return;
        }
        let audioCtx = this.engine.assets.audioCtx;
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        let trackSource = audioCtx.createBufferSource();
        trackSource.buffer = audioBuffer;
        trackSource.loop = loop;
        trackSource.connect(audioCtx.destination);
        trackSource.onended = () => {
            if (this.tracks[name]) {
                this.tracks[name] = undefined;
            }
        };
        trackSource.start(0, start, duration);
        return trackSource;
    }

    /**
     * Plays an audio file. Does nothing if it is already playing.
     *
     * @param {string} name - The asset name.
     */
    play(name)
    {
        if (!this.isOn) {
            return;
        }
        if (this.engine.assets.audioCtx) {
            if (this.tracks[name]) {
                return;
            }
            this.tracks[name] = this.createAndStartBufferSource({
                audioBuffer: this.engine.assets.getAudioBufferByName(name),
                name: name
            });
        } else {
            let asset = this.engine.assets.getByName(name);
            if (asset) {
                asset.loop = false;
                asset.play();
            }
        }
    }

    /**
     * Stops an audio file that is playing.
     *
     * @param {string} name - The asset name.
     */
    stop(name)
    {
        if (this.tracks[name]) {
            this.tracks[name].stop();
            return;
        }
        let asset = this.engine.assets.getByName(name);
        if (asset) {
            asset.pause();
            asset.currentTime = 0;
        }
    }

    /**
     * Plays an audio file and keeps looping it. Does nothing if the sound is already playing.
     *
     * @param {string} name - The asset name.
     */
    loop(name)
    {
        if (!this.isOn) {
            return;
        }
        if (this.engine.assets.audioCtx) {
            if (this.tracks[name]) {
                this.tracks[name].loop = true;
                return;
            }
            this.tracks[name] = this.createAndStartBufferSource({
                audioBuffer: this.engine.assets.getAudioBufferByName(name),
                name: name,
                loop: true
            });
        } else {
            let asset = this.engine.assets.getByName(name);
            if (asset) {
                asset.loop = true;
                asset.play();
            }
        }
    }

    /**
     * Plays a random chunk from the audio file. If no chunks are defined it will play the complete sound.
     *
     * @param {string} name - The asset name.
     */
    playRandom(name)
    {
        if (!this.isOn) {
            return;
        }
        let asset = (this.engine.assets.audioCtx) ? this.engine.assets.getAudioBufferByName(name) : this.engine.assets.getByName(name);
        if (asset) {
            if (!asset.chunks) {
                this.play(name);
                return;
            }
            asset.chunkIndex = Math.floor(Math.random() * asset.chunks.length);
            this.playChunk(asset, name);
        }
    }

    /**
     * Plays the next chunk from the audio file. If your chunks are notes that go up, this will create a positive feeling.
     *
     * @param {string} name - The asset name.
     */
    playUp(name)
    {
        if (!this.isOn) {
            return;
        }
        let asset = (this.engine.assets.audioCtx) ? this.engine.assets.getAudioBufferByName(name) : this.engine.assets.getByName(name);
        if (asset) {
            if (!asset.chunks) {
                this.play(name);
                return;
            }
            asset.chunkIndex += 1;
            if (asset.chunkIndex >= asset.chunks.length) {
                asset.chunkIndex = 0;
            }
            this.playChunk(asset, name);
        }
    }

    /**
     * Plays the previous chunk from the audio file. If your chunks are notes that go up, this will create a negative vibe as the notes will sound like they are going down.
     *
     * @param {string} name - The asset name.
     */
    playDown(name)
    {
        if (!this.isOn) {
            return;
        }
        let asset = (this.engine.assets.audioCtx) ? this.engine.assets.getAudioBufferByName(name) : this.engine.assets.getByName(name);
        if (asset) {
            if (!asset.chunks) {
                this.play(name);
                return;
            }
            asset.chunkIndex -= 1;
            if (asset.chunkIndex < 0) {
                asset.chunkIndex = asset.chunks.length - 1;
            }
            this.playChunk(asset, name);
        }
    }

    /**
     * Internal function that plays a chunk.
     *
     * @param {object} asset - The asset.
     * @param {string} name - The asset name.
     */
    playChunk(asset, name)
    {
        let end = asset.chunks[asset.chunkIndex].end;
        let start = asset.chunks[asset.chunkIndex].start;
        let duration = (end - start);

        if (this.engine.assets.audioCtx) {
            this.createAndStartBufferSource({
                audioBuffer: asset,
                name: name,
                start: start,
                duration: duration
            });
        } else {
            let clone = new Audio(this.engine.assets.getBlobByName(name));
            let playPromise = clone.play();
            if (playPromise) {
               playPromise.then(_ => {
                   clone.currentTime = start;
                   setTimeout(() => {
                        clone.pause();
                    }, duration * 1000);
               });
            } else {
               clone.currentTime = start;
               setTimeout(() => {
                    clone.pause();
                }, duration * 1000);
            }
        }
    }
}

export default Sound;
