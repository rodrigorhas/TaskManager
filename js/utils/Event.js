function Event(sender) {
    this._sender = sender;
    this._listeners = [];
}

Event.prototype = {
    listen: function (listener) {
        this._listeners.push(listener);
    },

    trigger: function (args) {
        var index;

        for (index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](args);
        }
    },

    unbind: function (listenerName) {
        this._listeners = [];
    }
};