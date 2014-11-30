define(function () {
    'use strict';

    var keywords = ['construct', 'extend', 'interfaces'],

        bindFunction = function (object, instance, function_name) {
            object[function_name] = (function () {
                var args = Array.prototype.slice.call(arguments),
                    inst = args.shift(),
                    func_name = args.shift(),

                    callback = function () {
                        return this[func_name].bind(this);
                    };

                return callback.call(inst, args);
            }(instance, function_name));
        },

        extendAbstract = function (object, proto, property_name) {
            if ('function' === typeof proto[property_name] && !object.hasOwnProperty(property_name)) {
                bindFunction(object, proto, property_name);
            }
        },

        parseFunction = function (object, proto, property_name) {
            if (-1 === keywords.indexOf(property_name) && 'function' === typeof proto[property_name]) {
                bindFunction(object, object.class, property_name);
            }
        },

        parseProperties = function (object, proto, context) {
            var property_name;

            for (property_name in proto) {
                if (proto.hasOwnProperty(property_name)) {
                    if (context === 'parent') {
                        extendAbstract(object, proto, property_name);
                    } else {
                        parseFunction(object, proto, property_name);
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
            var proto = Object.getPrototypeOf(object.class);
            parseProperties(object, proto, 'class');

            if (proto.hasOwnProperty('parent')) {
                protectProperty(object.class, 'parent', Object.create(proto.parent));
                parseProperties(object, proto.parent, 'parent');
            } else if (proto.hasOwnProperty(keywords[2])) {
                require(['doa/interface'], function (doa_interface) {
                    doa_interface(object, proto[keywords[2]]);
                });
            }
        },

        parseParentClass = function (extend) {
            var parent = {},
                parent_name;

            for (parent_name in extend) {
                if (extend.hasOwnProperty(parent_name)) {
                    parent = extend[parent_name];
                    parent.class_name = parent_name;
                    return parent;
                }
            }
        },

        addObjectDependencies = function (instance, dependencies) {
            if (dependencies && dependencies.interfaces) {
                instance.interfaces = dependencies.interfaces;
            }

            if (dependencies && dependencies.extend) {
                instance.parent = parseParentClass(dependencies.extend);
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
                            return;
                        };
                    }

                    protectProperty(this, 'class_name', class_name);

                    Object.getPrototypeOf(this.class).construct.apply(this.class, arguments);

                    return this;
                };
            addObjectDependencies(instance, dependencies);

            return constructor.bind(instance);
        };

    return objectConstructor;
});
