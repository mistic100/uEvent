const uevent = require('../index');
const assert = require('assert');

describe('Adding methods', function() {
    it('add methods to object', function() {
        const obj = {};
        uevent.mixin(obj);

        assert.ok('on' in obj);
        assert.ok('trigger' in obj);
    });

    it('add methods to prototype', function() {
        const Clazz = function() {
        };
        uevent.mixin(Clazz);

        const obj = new Clazz();

        assert.ok('on' in obj);
        assert.ok('trigger' in obj);
    });

    it('extends EventEmitter', function() {
        const Clazz = function() {
        };
        Clazz.prototype = new uevent.EventEmitter();
        Clazz.prototype.constructor = Clazz;

        const obj = new Clazz();

        assert.ok('on' in obj);
        assert.ok('trigger' in obj);
    });
});

describe('Basic usage', function() {
    it('trigger', function() {
        const obj = {};
        uevent.mixin(obj);

        let done = 0;
        obj.on('test', function() {
            done++;
        });
        obj.trigger('test');
        obj.trigger('test');

        assert.strictEqual(done, 2);
    });

    it('trigger w. parameters', function() {
        const obj = {};
        uevent.mixin(obj);

        let done = null;
        obj.on('test', function(e, a, b) {
            done = [a, b];
        });
        obj.trigger('test', 'foo', 'bar');

        assert.deepStrictEqual(done, ['foo', 'bar']);
    });

    it('once', function() {
        const obj = {};
        uevent.mixin(obj);

        let done = 0;
        obj.once('test', function() {
            done++;
        });
        obj.trigger('test');
        obj.trigger('test');

        assert.strictEqual(done, 1);
    });

    it('change', function() {
        const obj = {};
        uevent.mixin(obj);

        obj.on('test', function(e, v) {
            return v + 1;
        });
        obj.on('test', function(e, v) {
            return v + 1;
        });
        let done = obj.change('test', 0);

        assert.strictEqual(done, 2);
    });

    it('off', function() {
        const obj = {};
        uevent.mixin(obj);

        let done = 0;
        obj.on('test', function() {
            done++;
        });
        obj.off('test');
        obj.trigger('test');

        assert.equal(done, 0);
    });
});

describe('Separated instances', function() {
    it('different instances should not share events', function() {
        const Clazz = function() {
        };
        uevent.mixin(Clazz);

        const obj1 = new Clazz();
        const obj2 = new Clazz();

        let done = 0;
        obj1.on('test', function() {
            done++;
        });
        obj1.trigger('test');
        obj2.trigger('test');

        assert.strictEqual(done, 1);
    });
});

describe('Multiple events', function() {
    it('on', function() {
        const obj = {};
        uevent.mixin(obj);

        let done = 0;

        // add four handlers
        obj.on('test1 test2', function() {
            done++;
        });
        obj.on({
            test3: function() {
                done++;
            },
            test4: function() {
                done++;
            }
        });

        obj.trigger('test1');
        obj.trigger('test2');
        obj.trigger('test3');
        obj.trigger('test4');

        assert.strictEqual(done, 4);
    });

    it('off', function() {
        const obj = {};
        uevent.mixin(obj);

        let done = 0;
        const cb1 = function() {
            done++;
        };
        const cb2 = function() {
            done++;
        };

        // add 5 handlers
        obj.on('test1 test2', cb1);
        obj.on({
            test3: cb1,
            test4: cb2,
            test5: cb2
        });

        // remove two handlers
        obj.off('test1 test2');
        // remove on handler with cb check
        obj.off('test5', cb2);
        // remove two handlers with cb check
        obj.off({
            test3: cb1,
            test4: cb1 // won't work
        });

        obj.trigger('test1');
        obj.trigger('test2');
        obj.trigger('test3');
        obj.trigger('test4'); // will increment
        obj.trigger('test5');

        // remove all handlers
        obj.off();
        obj.trigger('test4');

        assert.strictEqual(done, 1);
    });
});

describe('Advanced', function() {
    it('stop propagation in trigger', function() {
        const obj = {};
        uevent.mixin(obj);

        let done = 0;

        obj.on('test', function(e) {
            done++;
            e.stopPropagation();
        });
        obj.on({
            test: function() {
                done++;
            }
        });

        obj.trigger('test');

        assert.strictEqual(done, 1);
    });

    it('stop propagation in once', function() {
        const obj = {};
        uevent.mixin(obj);

        let done = 0;

        obj.once('test', function(e) {
            done++;
            e.stopPropagation();
        });
        obj.once({
            test: function() {
                done++;
            }
        });

        obj.trigger('test');
        obj.trigger('test');

        assert.strictEqual(done, 1);
    });

    it('stop propagation in change', function() {
        const obj = {};
        uevent.mixin(obj);

        obj.on('test', function(e, v) {
            e.stopPropagation();
            return v + 1;
        });
        obj.on({
            test: function(e, v) {
                return v + 1;
            }
        });

        let done = obj.change('test', 0);

        assert.strictEqual(done, 1);
    });

    it('prevent default', function() {
        const obj = {};
        uevent.mixin(obj);

        obj.on('test', function(e) {
            e.preventDefault();
        });
        const e = obj.trigger('test');

        assert.ok(e.isDefaultPrevented());
    });

    it('use handleEvent', function() {
        const obj = {};
        uevent.mixin(obj);

        const listener = {
            done       : 0,
            handleEvent: function(e) {
                if (e.type === 'test' && e.args[0] === 'foo') {
                    this.done++;
                }
            }
        };
        obj.on('test', listener);
        obj.trigger('test', 'foo');

        assert.strictEqual(listener.done, 1);
    });
});
