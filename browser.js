/*!
 * uevent (v2.1.0)
 * @copyright 2015-2022 Damien "Mistic" Sorel <contact@git.strangeplanet.fr>
 * @licence MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.uEvent = {}));
})(this, (function (exports) { 'use strict';

    var returnTrue = function returnTrue() {
      return true;
    };

    var returnFalse = function returnFalse() {
      return false;
    };

    var Event = /*#__PURE__*/function () {
      /**
       * @param {*} target
       * @param {String} type
       * @param {Array} args
       */
      function Event(target, type, args) {
        Object.defineProperties(this, {
          'target': {
            get: function get() {
              return target;
            },
            set: function set() {},
            enumerable: true
          },
          'type': {
            get: function get() {
              return type;
            },
            set: function set() {},
            enumerable: true
          },
          'args': {
            get: function get() {
              return args;
            },
            set: function set() {},
            enumerable: true
          }
        });
        this.isDefaultPrevented = returnFalse;
        this.isPropagationStopped = returnFalse;
      }

      var _proto = Event.prototype;

      _proto.preventDefault = function preventDefault() {
        this.isDefaultPrevented = returnTrue;
      };

      _proto.stopPropagation = function stopPropagation() {
        this.isPropagationStopped = returnTrue;
      };

      return Event;
    }();

    var Event_1 = Event;

    /**
     * @typedef {Object.<String, Function>} Callbacks
     */

    var EventEmitter = /*#__PURE__*/function () {
      function EventEmitter() {}

      var _proto = EventEmitter.prototype;

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
      _proto.on = function on(events, callback, once) {
        var _this = this;

        if (once === void 0) {
          once = false;
        }

        this.__events = this.__events || {};

        if (typeof events === 'object') {
          for (var event in events) {
            if (events.hasOwnProperty(event)) {
              if (once) {
                events[event].__once = true;
              }

              this.__events[event] = this.__events[event] || [];

              this.__events[event].push(events[event]);
            }
          }
        } else {
          if (once) {
            callback.__once = true;
          }

          events.split(' ').forEach(function (event) {
            _this.__events[event] = _this.__events[event] || [];

            _this.__events[event].push(callback);
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
      ;

      _proto.off = function off(events, callback) {
        var _this2 = this;

        this.__events = this.__events || {};

        if (typeof events === 'object') {
          for (var event in events) {
            if (events.hasOwnProperty(event) && event in this.__events) {
              var index = this.__events[event].indexOf(events[event]);

              if (index !== -1) this.__events[event].splice(index, 1);
            }
          }
        } else if (!!events) {
          events.split(' ').forEach(function (event) {
            if (event in _this2.__events) {
              if (callback) {
                var _index = _this2.__events[event].indexOf(callback);

                if (_index !== -1) _this2.__events[event].splice(_index, 1);
              } else {
                _this2.__events[event].length = 0;
              }
            }
          });
        } else {
          this.__events = {};
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
      ;

      _proto.once = function once(events, callback) {
        return this.on(events, callback, true);
      }
      /**
       * Trigger all handlers for an event
       *
       * @param {String} event
       * @param {*...} [arguments]
       * @return {Event}
       */
      ;

      _proto.trigger = function trigger(event
      /* , args... */
      ) {
        var args = Array.prototype.slice.call(arguments, 1);
        var e = new Event_1(this, event, args);

        if (this.__events && event in this.__events) {
          var hasOnce = false;

          for (var i = 0, l = this.__events[event].length; i < l; i++) {
            var f = this.__events[event][i];

            if (f.__once) {
              hasOnce = true;
            }

            if (typeof f === 'object') {
              f.handleEvent(e);
            } else {
              f.call.apply(f, [this, e].concat(args));
            }

            if (e.isPropagationStopped()) {
              break;
            }
          }

          if (hasOnce) {
            this.__events[event] = this.__events[event].filter(function (f) {
              return !f.__once;
            });
          }
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
      ;

      _proto.change = function change(event, value
      /* , args... */
      ) {
        var args = Array.prototype.slice.call(arguments, 2);
        var e = new Event_1(this, event, args);
        e.value = value;

        if (this.__events && event in this.__events) {
          for (var i = 0, l = this.__events[event].length; i < l; i++) {
            var f = this.__events[event][i];

            if (f.__once) {
              continue;
            }

            if (typeof f === 'object') {
              e.value = f.handleEvent(e);
            } else {
              e.value = f.call.apply(f, [this, e, e.value].concat(args));
            }

            if (e.isPropagationStopped()) {
              break;
            }
          }
        }

        return e.value;
      };

      return EventEmitter;
    }();

    var EventEmitter_1 = EventEmitter;

    function mixin(target) {
      target = typeof target === 'function' ? target.prototype : target;
      ['on', 'off', 'once', 'trigger', 'change'].forEach(function (name) {
        target[name] = EventEmitter_1.prototype[name];
      });
      return target;
    }

    var uEvent = {
      EventEmitter: EventEmitter_1,
      Event: Event_1,
      mixin: mixin
    };
    var uEvent_1 = uEvent.EventEmitter;
    var uEvent_2 = uEvent.Event;
    var uEvent_3 = uEvent.mixin;

    exports.Event = uEvent_2;
    exports.EventEmitter = uEvent_1;
    exports["default"] = uEvent;
    exports.mixin = uEvent_3;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=browser.js.map
