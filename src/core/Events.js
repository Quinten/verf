class Events {

    constructor ()
    {
        this.listeners = {};
    }

    on (type, callback) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(
            callback
        );
    }

    once (type, callback) {
        let disposableCallback = (e) => {
            callback(e);
            this.off(type, disposableCallback);
        };
        this.on(type, disposableCallback);
    }

    off (type, callback) {
        if (!type) {
            this.listeners = {};
        }
        if (!this.listeners[type]) {
            return;
        }
        if (!callback) {
            this.listeners[type] = [];
        }
        this.listeners[type].splice(
            this.listeners[type]
                .indexOf(callback),
            1
        );
    }

    emit (type, e) {
        if (!this.listeners[type]) {
            return;
        }
        this.listeners[type].forEach(
            (callback) => {
                callback(e);
        });
    }
}
export default Events;
