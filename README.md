# MicroEvent.js

_MicroEvent.js_ is a event emitter library which provides the [observer pattern](http://en.wikipedia.org/wiki/Observer_pattern) to javascript objects.
It works on node.js and browser and also supports RequireJS (AMD).

## How to Use It

You need a single file [microevent.js](https://github.com/mistic100/microevent.js/blob/master/microevent.js).
Include it in a webpage via the usual script tag.

```html
<script src="microevent.js"></script>
```

To include it in a nodejs code isnt much harder

```js
var MicroEvent = require('./microevent.js')
```

Now suppose you got a class `Foobar`, and you wish it to support the observer partern. do

```js
MicroEvent.mixin(Foobar)
```

## Example

First we define the class which gonna use MicroEvent.js. This is a ticker, it is
triggering 'tick' event every second, and add the current date as parameter

```js
var Ticker = function(){
    var self = this;
    setInterval(function(){
        self.trigger('tick', new Date());
    }, 1000);
};
```

We mixin _MicroEvent_ into _Ticker_ and we are all set.

```
MicroEvent.mixin(Ticker);
```

Now lets actually use the _Ticker_ Class. First, create the object.

```js
var ticker = new Ticker();
```

and bind our _tick_ event with its data parameter

```js
ticker.on('tick', function(date) {
    console.log('notified date', date);
});
```

And you will see this output:

```
notified date Tue, 22 Mar 2011 14:43:41 GMT
notified date Tue, 22 Mar 2011 14:43:42 GMT
...
```
