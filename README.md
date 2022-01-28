uEvent
------

[![npm version](https://img.shields.io/npm/v/uevent.svg?style=flat-square)](https://www.npmjs.com/package/uevent)
[![jsDelivr CDN](https://data.jsdelivr.com/v1/package/npm/uevent/badge)](https://www.jsdelivr.com/package/npm/uevent)
[![GZIP size](https://flat.badgen.net/bundlephobia/minzip/uevent)](https://bundlephobia.com/result?p=uevent)
[![Build Status](https://github.com/mistic100/uEvent/workflows/CI/badge.svg)](https://github.com/mistic100/uEvent/actions)

_uEvent_ is a event emitter library which provides the [observer pattern](http://en.wikipedia.org/wiki/Observer_pattern) to javascript objects.
It works on node.js and browser and also supports RequireJS (AMD).

It is a fork of [jeromeetienne/microevents.js](https://github.com/jeromeetienne/microevent.js) with the changes of few other forks and custom changes.


# Features

* jQuery-like API (`on`, `off`, `once`, `trigger`)
* Value modifier support
* **prevent default** and **stop propagation** patterns
* [handleEvent](https://developer.mozilla.org/en/docs/Web/API/EventListener#handleEvent()) support


# Installation

```
$ npm install uevent
```


# Usage

## Create an emitter

**Direct**

```js
import { EventEmitter } from 'uevent';

const obj = new EventEmitter();
```

**Class extend**

```js
class Manager extends EventEmitter {

}

class obj = new Manager();
```

**Mixin**

```js
import { mixin as eventEmitterMixin } from 'uevent';

const obj = {};

eventEmitterMixin(obj);
```


## Register event handlers

### `on`

Add one or many event handlers.

```js
// bind 'callback' to 'event'
obj.on('event', callback);

// bind 'callback' to 'event1' and 'event2'
obj.on('event1 event2', callback);

// bind 'callback1' to 'event1' and 'callback2' to 'event2'
obj.on({
  event1: callback1,
  event2: callback2
});
```

### `off`

Remove one or many or all event handlers.

```js
// remove all callbacks for 'event'
obj.off('event');

// remove 'callback' if attached to 'event'
obj.off('event', callback);

// remove all callbacks for 'event1' and 'event2'
obj.off('event1 event2');

// remove 'callback1' if attached to 'event1' and 'callback2' if attached to 'event2'
obj.off({
  event1: callback1,
  event2: callback2
});

// remove all callbacks
obj.off();
```

### `once`

Same as `on` but the callbacks will be removed after the first invocation.

The callbacks attached once are **only** called by `trigger` and **not** by `change`.

### Callback signature

The first parameter of the callback is always an `Event` object having the following properties :

- `type` the name of the event
- `target` the source object of the event
- `args` additional parameters

When additional parameters are provided they are passed to the callback :

```js
const callback = function(event, param1, param2) {};
```

When using the `handleEvent` feature you only get the event object :

```js
const listener = {
    handleEvent: function(event) {}
};
```

## Trigger events

### `trigger`

Trigger all handlers for an event. Accept optional arguments transmitted to the callbacks.

```js
// trigger 'event'
obj.trigger('event');

// trigger 'event' with arguments
obj.trigger('event', true, 42);
```

### `change`

Works like `trigger` but returns a value. This is used to filter a value before display for example. All callbacks **must** accept at least on input value and return the modified (or not) value.

```js
// call 'event' filters with 'Hello world' input
var newVal = obj.change('event', 'Hello world')

// call 'event' filters with 'Hello world' input and other arguments
var newVal = obj.change('event', 'Hello world', true, 42)
```

The `Event` object has an additional `value` property which holds the current value.


## Advanced

### Prevent default

Call `preventDefault()` on this `Event` object to "mark" the event. After calling `trigger` you get a reference to this `Event` object and can test `isDefaultPrevented()`.

```js
obj.on('event', function(e, id) {
  if (id == 0) {
    e.preventDefault();
  }
});

const e = obj.trigger('event', id);

if (!e.isDefaultPrevented()) {
  // ...
}
```

### Stop propagation

Call `stopPropagation()` on the `Event` object to prevent any further callbacks to be called. Works for `trigger` and `change`.

```js
obj.on('event', function(e, val) {
  e.stopPropagation();
  return val;
});

obj.on('event', function(e, val) {
  return 'azerty';
});

const newVal = obj.change('event', '1234');
// newVal is still '1234'
```


# License
This library is available under the MIT license.
