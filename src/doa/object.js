define(function () {
    'use strict';

    var keywords = ['construct', 'implement', 'extend'],

        bindFunction = function (object, function_name) {
            object[function_name] = (function () {
                var args = Array.prototype.slice.call(arguments),

                    inst = args.shift(),

                    func_name = args.shift(),

                    callback = function () {
                        return this[func_name].bind(this);
                    };

                return callback.call(inst.class.__proto__, args);
            }(object, function_name));
        },

        implementObjects = function () {
            return;
        },

        extendObjects = function () {
            return;
        },

        parseProperty = function (object, property) {
            if (-1 === keywords.indexOf(property) && 'function' === typeof object.class.__proto__[property]) {
                bindFunction(object, property);
            } else if (property === keywords[1]) {
                implementObjects();
            } else if (property === keywords[2]) {
                extendObjects();
            }
        },

        clone = function (object) {
            var Clone = function () {
                return;
            };

            Clone.prototype = object;
            return new Clone();
        },

        parseObject = function (object) {
            var property;
            for (property in object.class.__proto__) {
                if (object.class.__proto__.hasOwnProperty(property)) {
                    parseProperty(object, property);
                }
            }
        },

        objectConstructor = function (name, object) {
            var instance = (undefined === object) ? name : object,
                class_name = (undefined === object) ? 'anonymous' : name,

                constructor = function () {
                    this.class = clone(instance);
                    parseObject(this);

                    if (!this.class.__proto__.hasOwnProperty(keywords[0])) {
                        this.class.__proto__.construct = function () {
                            return instance;
                        };
                    }

                    this.class.__proto__.construct.apply(this.class, arguments);

                    return this;
                };

            constructor.getClassName = function () {
                return class_name;
            };

            return constructor.bind(instance);
        };

    return objectConstructor;
});
