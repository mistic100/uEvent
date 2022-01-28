const EventEmitter = require('./src/EventEmitter');
const Event = require('./src/Event');

function mixin(target) {
    target = typeof target === 'function' ? target.prototype : target;

    ['on', 'off', 'once', 'trigger', 'change'].forEach((name) => {
        target[name] = EventEmitter.prototype[name];
    });

    return target;
}

module.exports = {
    EventEmitter: EventEmitter,
    Event       : Event,
    mixin       : mixin,
};
