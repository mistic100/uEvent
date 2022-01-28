declare namespace uevent {

    interface Event {
        readonly target: any;
        readonly type: string;
        readonly args: any[];

        isDefaultPrevented(): boolean;

        isPropagationStopped(): boolean;

        preventDefault();

        stopPropagation();
    }

    interface ValueEvent<T> extends Event {
        readonly value: T;
    }

    interface EventListener {
        handleEvent(e: Event): void;

        handleEvent<T>(e: ValueEvent<T>): T;
    }

    type Callback = (e: Event, ...args: any[]) => void;

    type Callbacks = { [event: string]: Callback | EventListener };

    type ValueCallback<T> = (e: ValueEvent<T>, value: T, ...args: any[]) => T;

    type ValueCallbacks<T> = { [event: string]: ValueCallback<T> | EventListener };

    interface EventEmitter {
        on(events: string | Callbacks, callback?: Callback | EventListener): this;

        on<T>(events: string | ValueCallbacks<T>, callback?: ValueCallback<T> | EventListener): this;

        off(events?: string | Callbacks, callback?: Callback | EventListener): this;

        off<T>(events?: string | ValueCallbacks<T>, callback?: ValueCallback<T> | EventListener): this;

        once(events: string | Callbacks, callback?: Callback | EventListener): this;

        trigger(event: string, ...args: any[]): Event;

        change<T>(event: string, value: T, ...args: any[]): T;
    }
}

declare const uevent: {
    EventEmitter: {
        new(): uevent.EventEmitter;
    };
    Event: Event,
    mixin: <T>(target: T) => T;
};
export = uevent;
export as namespace uevent;
