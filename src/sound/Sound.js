class Sound {

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
    }

    get isOn() {
        return this._isOn;
    }

    set isOn(value) {
        this._isOn = value;
        localStorage.setItem(this.key, (value) ? 'on' : 'off');
    }

    play(name)
    {
        if (!this.isOn) {
            return;
        }
        let asset = this.engine.assets.getByName(name);
        if (asset) {
            asset.loop = false;
            asset.play();
        }
    }

    pause(name)
    {
        let asset = this.engine.assets.getByName(name);
        if (asset) {
            asset.pause();
        }
    }

    stop(name)
    {
        let asset = this.engine.assets.getByName(name);
        if (asset) {
            asset.pause();
            asset.currentTime = 0;
        }
    }

    loop(name)
    {
        if (!this.isOn) {
            return;
        }
        let asset = this.engine.assets.getByName(name);
        if (asset) {
            asset.loop = true;
            asset.play();
        }
    }

    playRandom(name)
    {
        if (!this.isOn) {
            return;
        }
        let asset = this.engine.assets.getByName(name);
        if (asset) {
            if (!asset.chunks) {
                this.play(name);
                return;
            }
            if (!asset.paused) {
                return;
            }
            asset.chunkIndex = Math.floor(Math.random() * asset.chunks.length);
            this.playChunk(asset);
        }
    }

    playUp(name)
    {
        if (!this.isOn) {
            return;
        }
        let asset = this.engine.assets.getByName(name);
        if (asset) {
            if (!asset.chunks) {
                this.play(name);
                return;
            }
            if (!asset.paused) {
                return;
            }
            asset.chunkIndex += 1;
            if (asset.chunkIndex >= asset.chunks.length) {
                asset.chunkIndex = 0;
            }
            this.playChunk(asset);
        }
    }

    playDown(name)
    {
        if (!this.isOn) {
            return;
        }
        let asset = this.engine.assets.getByName(name);
        if (asset) {
            if (!asset.chunks) {
                this.play(name);
                return;
            }
            if (!asset.paused) {
                return;
            }
            asset.chunkIndex -= 1;
            if (asset.chunkIndex < 0) {
                asset.chunkIndex = asset.chunks.length - 1;
            }
            this.playChunk(asset);
        }
    }

    playChunk(asset)
    {
        let end = asset.chunks[asset.chunkIndex].end;
        let start = asset.chunks[asset.chunkIndex].start;
        asset = asset.cloneNode();
        let timeUpdateHandler = (e) => {
            if (asset.currentTime > end) {
                asset.pause();
                asset.removeEventListener('timeupdate', timeUpdateHandler);
            }
        };
        asset.addEventListener('timeupdate', timeUpdateHandler, false);
        asset.play();
        asset.currentTime = start;
    }
}

export default Sound;
