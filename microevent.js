/*!
 * MicroEvent - to make any js object an event emitter
 * Copyright 2011 Jerome Etienne (http://jetienne.com)
 * Copyright 2015 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

(function(root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    }
    else if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else {
        root.MicroEvent = factory();
    }
}(this, function() {
    "use strict";

    var MicroEvent = function(){};

    MicroEvent.prototype = {
        /**
         * Add one or many event handlers
         *
         * @param {String,Object} events
         * @param {Function} optional, callback
         *
         * obj.on('event', callback)
         * obj.on('event1 event2', callback)
         * obj.on({ event1: callback1, event2: callback2 })
         */
        on: function (events, fct) {
            this._events = this._events || {};

            if (typeof events === 'object') {
                for (var event in events) {
                    if (events.hasOwnProperty(event)) {
                        this._events[event] = this._events[event] || [];
                        this._events[event].push(events[event]);
                    }
                }
            }
            else {
                events.split(' ').forEach(function(event) {
                    this._events[event] = this._events[event] || [];
                    this._events[event].push(fct);
                }, this);
            }

            return this;
        },

        /**
         * Remove one or many or all event handlers
         *
         * @param {String,Object} optional, events
         * @param {Function} optional, callback
         *
         * obj.off('event')
         * obj.off('event', callback)
         * obj.off('event1 event2')
         * obj.off({ event1: callback1, event2: callback2 })
         * obj.off()
         */
        off: function (events, fct) {
            this._events = this._events || {};

            if (typeof events === 'object') {
                for (var event in events) {
                    if (events.hasOwnProperty(event) && (event in this._events)) {
                        var index = this._events[event].indexOf(events[event]);
                        if (index !== -1) this._events[event].splice(index, 1);
                    }
                }
            }
            else if (!!events) {
                events.split(' ').forEach(function(event) {
                    if (event in this._events) {
                        if (fct) {
                            var index = this._events[event].indexOf(fct);
                            if (index !== -1) this._events[event].splice(index, 1);
                        }
                        else {
                            this._events[event] = [];
                        }
                    }
                }, this);
            }
            else {
                this._events = {};
            }

            return this;
        },
        
        /**
         * Add one or many event handlers that will be called only once
         * This handlers are only applicable to "trigger", not "change"
         *
         * @param {String,Object} events
         * @param {Function} optional, callback
         *
         * obj.once('event', callback)
         * obj.once('event1 event2', callback)
         * obj.once({ event1: callback1, event2: callback2 })
         */
        once: function (events, fct) {
            this._once = this._once || {};

            if (typeof events === 'object') {
                for (var event in events) {
                    if (events.hasOwnProperty(event)) {
                        this._once[event] = this._once[event] || [];
                        this._once[event].push(events[event]);
                    }
                }
            }
            else {
                events.split(' ').forEach(function(event) {
                    this._once[event] = this._once[event] || [];
                    this._once[event].push(fct);
                }, this);
            }

            return this;
        },

        /**
         * Trigger all handlers for an event
         *
         * @param {String} event name
         * @param {Mixed...} optional, arguments
         */
        trigger: function (event /* , args... */) {
            this._events = this._events || {};
            this._once = this._once || {};
            
            var args = Array.prototype.slice.call(arguments, 1),
                callbacks;
            
            if (event in this._events) {
                callbacks = this._events[event].slice();
                while (callbacks.length) {
                    callbacks.shift().apply(this, args);
                }
            }

            if (event in this._once) {
                callbacks = this._once[event].slice();
                while (callbacks.length) {
                    callbacks.shift().apply(this, args);
                }
                delete this._once[event];
            }

            return this;
        },

        /**
         * Trigger all modificators for an event, each handler must return a value
         *
         * @param {String} event name
         * @param {Mixed} event value
         * @param {Mixed...} optional, arguments
         */
        change: function(event, value /* , args... */) {
            this._events = this._events || {};

            if (event in this._events) {
                var args = Array.prototype.slice.call(arguments, 1);

                for (var i=0, l=this._events[event].length; i<l; i++) {
                    args[0] = value;
                    value = this._events[event][i].apply(this, args);
                }
            }

            return value;
        }
    };

    /**
     * Copy all MicroEvent.js functions in the destination object
     *
     * @param {Object} the object which will support MicroEvent
     * @param {Object} optional, strings map to rename methods
     */
    MicroEvent.mixin = function (obj, names) {
        names = names || {};
        var props = ['on', 'off', 'once', 'trigger', 'change'];

        for (var i=0, l=props.length; i<l; i++) {
            var method = names[props[i]] || props[i];

            if (typeof obj === 'function') {
                obj.prototype[method] = MicroEvent.prototype[props[i]];
            }
            else {
                obj[method] = MicroEvent.prototype[props[i]];
            }
        }
    };

    return MicroEvent;
}));