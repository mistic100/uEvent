const returnTrue = () => {
    return true;
};

const returnFalse = () => {
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
                get       : () => {
                    return target;
                },
                set       : () => {},
                enumerable: true
            },
            'type'  : {
                get       : () => {
                    return type;
                },
                set       : () => {},
                enumerable: true
            },
            'args'  : {
                get       : () => {
                    return args;
                },
                set       : () => {},
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
