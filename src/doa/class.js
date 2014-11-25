define(function () {
    'use strict';

    var keywords = ['construct', 'extend', 'interfaces'],

        bindFunction = function (object, function_name) {
            object[function_name] = (function () {
                var args = Array.prototype.slice.call(arguments),

                    inst = args.shift(),

                    func_name = args.shift(),

                    callback = function () {
                        return this[func_name].bind(this);
                    };

                return callback.call(Object.getPrototypeOf(inst.class), args);
            }(object, function_name));
        },

        extendObjects = function () {
            return;
        },

        parseProperty = function (object, property) {
            if (-1 === keywords.indexOf(property) && 'function' === typeof Object.getPrototypeOf(object.class)[property]) {
                bindFunction(object, property);
            }
        },

        parseObject = function (object) {
            var property;
            for (property in Object.getPrototypeOf(object.class)) {
                if (Object.getPrototypeOf(object.class).hasOwnProperty(property)) {
                    parseProperty(object, property);
                }
            }
            if (property === keywords[1]) {
                extendObjects();
            } else if (Object.getPrototypeOf(object.class).hasOwnProperty(keywords[2])) {
                require(['doa/interface'], function (doa_interface) {
                    doa_interface(object, Object.getPrototypeOf(object.class)[keywords[2]]);
                });
            }
        },

        objectConstructor = function (name, object, dependencies) {
            var instance = (undefined === object) ? name : object,
                class_name = (undefined === object) ? 'anonymous' : name,

                constructor = function () {
                    this.class = Object.create(instance);
                    parseObject(this);

                    if (!Object.getPrototypeOf(this.class).hasOwnProperty(keywords[0])) {
                        Object.getPrototypeOf(this.class).construct = function () {
                            return instance;
                        };
                    }

                    Object.defineProperty(this, 'class_name', {
                        value: class_name,
                        enumerable: false,
                        writable: false,
                        configurable: false
                    });

                    Object.getPrototypeOf(this.class).construct.apply(this.class, arguments);

                    return this;
                };

            if (dependencies && dependencies.interfaces) {
                instance.interfaces = dependencies.interfaces;
            }

            return constructor.bind(instance);
        };

    return objectConstructor;
});
