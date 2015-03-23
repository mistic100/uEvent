var MicroEvent = require('../microevent.js'),
    assert = require('assert');

describe('Adding methods', function() {
    it('add methods to object', function() {
        var obj = {};
        MicroEvent.mixin(obj);
        
        assert.ok('on' in obj);
        assert.ok('trigger' in obj);
    });
    
    it('add methods to prototype', function() {
        var clazz = function(){};
        MicroEvent.mixin(clazz);
        var obj = new clazz();
        
        assert.ok('on' in obj);
        assert.ok('trigger' in obj);
    });
    
    it('add renamed methods to object', function() {
        var obj = {};
        MicroEvent.mixin(obj, {'on': 'bind'});
        
        assert.ok('bind' in obj);
        assert.ok(!('on' in obj));
    });
});

describe('Basic usage', function() {
    it('trigger', function() {
        var obj = {};
        MicroEvent.mixin(obj);
        
        var done = 0;
        obj.on('test', function() { done++; });
        obj.trigger('test');
        obj.trigger('test');
        
        assert.equal(done, 2);
    });
    
    it('once', function() {
        var obj = {};
        MicroEvent.mixin(obj);
        
        var done = 0;
        obj.once('test', function() { done++; });
        obj.trigger('test');
        obj.trigger('test');
        
        assert.equal(done, 1);
    });
    
    it('change', function() {
        var obj = {};
        MicroEvent.mixin(obj);
        
        obj.on('test', function(v) { return v+1; });
        obj.on('test', function(v) { return v+1; });
        var done = obj.change('test', 0);
        
        assert.equal(done, 2);
    });
    
    it('off', function() {
        var obj = {};
        MicroEvent.mixin(obj);
        
        var done = 0;
        obj.on('test', function() { done++; });
        obj.off('test');
        obj.trigger('test');
        
        assert.equal(done, 0);
    });
});

describe('Separated instances', function() {
    it('different instances should not share events', function() {
        var clazz = function(){};
        MicroEvent.mixin(clazz);
        var obj1 = new clazz();
        var obj2 = new clazz();
        
        var done = 0;
        obj1.on('test', function() { done++; });
        obj1.trigger('test');
        obj2.trigger('test');
        
        assert.equal(done, 1);
    });
});

describe('Multiple events', function() {
    it('on', function() {
        var obj = {};
        MicroEvent.mixin(obj);
        
        var done = 0;
        obj.on('test1 test2', function() { done++; });
        obj.on({
            test3: function() { done++; },
            test4: function() { done++; }
        });
        obj.trigger('test1');
        obj.trigger('test2');
        obj.trigger('test3');
        obj.trigger('test4');
        
        assert.equal(done, 4);
    });
    
    it('off', function() {
        var obj = {};
        MicroEvent.mixin(obj);
        
        var done = 0;
        obj.on('test1 test2', function() { done++; });
        obj.on({
            test3: function() { done++; },
            test4: function() { done++; }
        });
        obj.off('test1 test4');
        obj.trigger('test1');
        obj.trigger('test2');
        obj.trigger('test3');
        obj.trigger('test4');
        
        assert.equal(done, 2);
    });
});

describe('Advanced', function() {
    it('stop propagation in trigger', function() {
        var obj = {};
        MicroEvent.mixin(obj);
    
        var done = 0;
        obj.on('test', function(e) {
            done++;
            e.stopPropagation();
        });
        obj.on('test', function(e) { done++; });
        obj.trigger('test');
        
        assert.equal(done, 1);
    });
    
    it('stop propagation in change', function() {
        var obj = {};
        MicroEvent.mixin(obj);
    
        obj.on('test', function(v, e) {
            e.stopPropagation();
            return v+1;
        });
        obj.on('test', function(v, e) { return v+1; });
        var done = obj.change('test', 0);
        
        assert.equal(done, 1);
    });
    
    it('prevent default', function() {
        var obj = {};
        MicroEvent.mixin(obj);
    
        obj.on('test', function(e) {
            e.preventDefault();
        });
        var e = obj.trigger('test');
        
        assert.ok(e.isDefaultPrevented());
    });
});