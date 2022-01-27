const EventEmitter = require('./src/EventEmitter');

function mixin(target) {
    target = typeof target === 'function' ? target.prototype : target;

    ['on', 'off', 'once', 'trigger', 'change'].forEach((name) => {
        target[name] = EventEmitter.prototype[name];
    });

    return target;
}

module.exports = {
    EventEmitter: EventEmitter,
    mixin       : mixin,
};
