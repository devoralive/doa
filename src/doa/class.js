define(function () {
    'use strict';

    var keywords = ['construct', 'extend', 'interfaces'],

        bindFunction = function (object, function_name, context) {
            context = context || 'class';
            object[function_name] = (function () {
                var args = Array.prototype.slice.call(arguments),
                    inst = args.shift(),
                    func_name = args.shift(),

                    callback = function () {
                        return Object.getPrototypeOf(this)[func_name].bind(this);
                    };

                return callback.call(inst[context], args);
            }(object, function_name));
        },

        extendAbstract = function (object, proto, property_name) {
            if ('function' === typeof proto[property_name] && !object.hasOwnProperty(property_name)) {
                bindFunction(object, property_name, 'parent');
            }
        },

        parseFunction = function (object, proto, property_name) {
            if (-1 === keywords.indexOf(property_name) && 'function' === typeof proto[property_name]) {
                bindFunction(object, property_name);
            }
        },

        parseProperties = function (object, context) {
            var proto = Object.getPrototypeOf(object[context]),
                property_name;

            for (property_name in proto) {
                if (proto.hasOwnProperty(property_name)) {
                    if (context === 'class') {
                        parseFunction(object, proto, property_name);
                    } else {
                        extendAbstract(object, proto, property_name);
                    }
                }
            }
        },

        protectProperty = function (object, property_name, value) {
            Object.defineProperty(object, property_name, {
                value: value,
                enumerable: false,
                writable: false,
                configurable: false
            });
        },

        parseObject = function (object) {
            parseProperties(object, 'class');

            if (Object.getPrototypeOf(object.class).hasOwnProperty(keywords[1])) {
                protectProperty(this, 'parent', Object.create(object));
                parseProperties(object, 'parent');
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
                    protectProperty(this, 'class', Object.create(instance));
                    parseObject(this);

                    if (!Object.getPrototypeOf(this.class).hasOwnProperty(keywords[0])) {
                        Object.getPrototypeOf(this.class).construct = function () {
                            return instance;
                        };
                    }

                    protectProperty(this, 'class_name', class_name);

                    Object.getPrototypeOf(this.class).construct.apply(this.class, arguments);

                    return this;
                };

            if (dependencies && dependencies.interfaces) {
                instance.interfaces = dependencies.interfaces;
            }

            if (dependencies && dependencies.extend) {
                instance.parent = dependencies.extend;
            }

            return constructor.bind(instance);
        };

    return objectConstructor;
});
