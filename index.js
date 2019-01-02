const EventEmitter = require('./src/EventEmitter');

function mixin(target) {
    target = typeof target === 'function' ? target.prototype : target;

    ['on', 'off', 'once', 'trigger', 'change'].forEach(function(name) {
        target[name] = EventEmitter.prototype[name];
    });

    Object.defineProperties(target, {
        '__events': {
            value   : null,
            writable: true
        },
        '__once'  : {
            value   : null,
            writable: true
        }
    });
}

module.exports = {
    EventEmitter: EventEmitter,
    mixin       : mixin,
};
