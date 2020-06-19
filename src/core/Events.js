/**
 * Simple event emitter class. Almost all objects in the framework use this as their base class.
 *
 * @memberof module:core~
 */
class Events {

    constructor ()
    {
        /**
         * A dictionary of the event callbacks attached to this object.
         *
         * @type {object}
         */
        this.listeners = {};
    }

    /**
     * Continually listen on this object for an event.
     *
     * @param {string} type - The name of the event.
     * @param {function} callback - The function to execute each time the event is emitted.
     */
    on (type, callback) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(
            callback
        );
    }

    /**
     * Listen on this object for an event, but execute the callback only once.
     *
     * @param {string} type - The name of the event.
     * @param {function} callback - The function to execute once.
     */
    once (type, callback) {
        let disposableCallback = (e) => {
            callback(e);
            this.off(type, disposableCallback);
        };
        this.on(type, disposableCallback);
    }

    /**
     * Removes listeners from this object.
     *
     * @param {string} [type] - The name of the event to remove callback(s) for. If left empty, it will remove every single callback from this object.
     * @param {function} [callback] - The callback to remove. If left empty, it will remove all callbacks for the given type or when the type is empty every single callback on this object.
     */
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

    /**
     * Emits the event of a certain type and executes all callbacks.
     *
     * @param {string} type - The name of the event it emits.
     * @param {object} [e] - An optional object that will be passed to the callbacks first argument.
     */
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
