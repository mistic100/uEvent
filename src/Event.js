const returnTrue = function() {
    return true;
};

const returnFalse = function() {
    return false;
};

class Event {

    /**
     * @param {*} target
     * @param {String} type
     * @param {Array} args
     */
    constructor(target, type, args) {
        Object.defineProperties(this, {
            'target': {
                get       : function() {
                    return target;
                },
                set       : function(value) {
                },
                enumerable: true
            },
            'type'  : {
                get       : function() {
                    return type;
                },
                set       : function(value) {
                },
                enumerable: true
            },
            'args'  : {
                get       : function() {
                    return args;
                },
                set       : function(value) {
                },
                enumerable: true
            }
        });

        this.isDefaultPrevented = returnFalse;
        this.isPropagationStopped = returnFalse;
    }

    preventDefault() {
        this.isDefaultPrevented = returnTrue;
    }

    stopPropagation() {
        this.isPropagationStopped = returnTrue;
    }

}

module.exports = Event;
