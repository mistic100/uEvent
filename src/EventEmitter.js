const Event = require('./Event');

/**
 * @typedef {Object.<String, Function>} Callbacks
 */

class EventEmitter {

    /**
     * Add one or many event handlers
     *
     * @example
     *  obj.on('event', callback)
     *  obj.on('event', listener) // listener has an `handleEvent` method
     *  obj.on('event1 event2', callback)
     *  obj.on({ event1: callback1, event2: callback2 })
     *
     * @param {String|Callbacks} events
     * @param {Function} [callback]
     * @return {this}
     */
    on(events, callback) {
        this.__events = this.__events || {};

        if (typeof events === 'object') {
            for (const event in events) {
                if (events.hasOwnProperty(event)) {
                    this.__events[event] = this.__events[event] || [];
                    this.__events[event].push(events[event]);
                }
            }
        }
        else {
            events.split(' ').forEach((event) => {
                this.__events[event] = this.__events[event] || [];
                this.__events[event].push(callback);
            });
        }

        return this;
    }

    /**
     * Remove one or many or all event handlers
     *
     * @example
     *  obj.off('event')
     *  obj.off('event', callback)
     *  obj.off('event1 event2')
     *  obj.off({ event1: callback1, event2: callback2 })
     *  obj.off()
     *
     * @param {String|Callbacks} [events]
     * @param {Function} [callback]
     * @return {this}
     */
    off(events, callback) {
        if (typeof events === 'object') {
            for (const event in events) {
                if (events.hasOwnProperty(event)) {
                    if (this.__events && (event in this.__events)) {
                        const index = this.__events[event].indexOf(events[event]);
                        if (index !== -1) this.__events[event].splice(index, 1);
                    }
                    if (this.__once && (event in this.__once)) {
                        const index = this.__once[event].indexOf(events[event]);
                        if (index !== -1) this.__once[event].splice(index, 1);
                    }
                }
            }
        }
        else if (!!events) {
            events.split(' ').forEach((event) => {
                if (this.__events && (event in this.__events)) {
                    if (callback) {
                        const index = this.__events[event].indexOf(callback);
                        if (index !== -1) this.__events[event].splice(index, 1);
                    }
                    else {
                        this.__events[event].length = 0;
                    }
                }
                if (this.__once && (event in this.__once)) {
                    if (callback) {
                        const index = this.__once[event].indexOf(callback);
                        if (index !== -1) this.__once[event].splice(index, 1);
                    }
                    else {
                        this.__once[event].length = 0;
                    }
                }
            });
        }
        else {
            this.__events = {};
            this.__once = {};
        }

        return this;
    }

    /**
     * Add one or many event handlers that will be called only once
     * This handlers are only applicable to "trigger", not "change"
     *
     * @example
     *  obj.once('event', callback)
     *  obj.once('event1 event2', callback)
     *  obj.once({ event1: callback1, event2: callback2 })
     *
     * @param {String|Callbacks} events
     * @param {Function} [callback]
     * @return {this}
     */
    once(events, callback) {
        this.__once = this.__once || {};

        if (typeof events === 'object') {
            for (const event in events) {
                if (events.hasOwnProperty(event)) {
                    this.__once[event] = this.__once[event] || [];
                    this.__once[event].push(events[event]);
                }
            }
        }
        else {
            events.split(' ').forEach((event) => {
                this.__once[event] = this.__once[event] || [];
                this.__once[event].push(callback);
            });
        }

        return this;
    }

    /**
     * Trigger all handlers for an event
     *
     * @param {String} event
     * @param {*...} [arguments]
     * @return {Event}
     */
    trigger(event /* , args... */) {
        const args = Array.prototype.slice.call(arguments, 1);
        const e = new Event(this, event, args);

        if (this.__events && (event in this.__events)) {
            for (let i = 0, l = this.__events[event].length; i < l; i++) {
                const f = this.__events[event][i];
                if (typeof f === 'object') {
                    f.handleEvent(e);
                }
                else {
                    f.call(this, e, ...args);
                }
                if (e.isPropagationStopped()) {
                    break;
                }
            }
        }

        if (this.__once && (event in this.__once)) {
            for (let i = 0, l = this.__once[event].length; i < l; i++) {
                const f = this.__once[event][i];
                if (typeof f === 'object') {
                    f.handleEvent(e);
                }
                else {
                    f.call(this, e, ...args);
                }
                if (e.isPropagationStopped()) {
                    break;
                }
            }
            delete this.__once[event];
        }

        return e;
    }

    /**
     * Trigger all modificators for an event, each handler must return a value
     *
     * @param {String} event
     * @param {*} value
     * @param {*...} [arguments]
     * @return {*} modified value
     */
    change(event, value /* , args... */) {
        const args = Array.prototype.slice.call(arguments, 2);
        const e = new Event(this, event, args);
        e.value = value;

        if (this.__events && event in this.__events) {
            for (let i = 0, l = this.__events[event].length; i < l; i++) {
                const f = this.__events[event][i];
                if (typeof f === 'object') {
                    e.value = f.handleEvent(e);
                }
                else {
                    e.value = f.call(this, e, e.value, ...args);
                }
                if (e.isPropagationStopped()) {
                    break;
                }
            }
        }

        return e.value;
    }

}

module.exports = EventEmitter;
