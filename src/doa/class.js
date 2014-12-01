define(['doa/function', 'doa/abstract'], function (doa_function, doa_abstract) {
    'use strict';

    var parseProperties = function (object, proto, context) {
            var property_name;

            for (property_name in proto) {
                if (proto.hasOwnProperty(property_name)) {
                    if (context === 'parent') {
                        doa_abstract.extendAbstract(object, proto, property_name);
                    } else {
                        doa_function.parseFunction(object, proto, property_name);
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

        parseObject = function (object, dependencies) {
            var proto = Object.getPrototypeOf(object.class);
            parseProperties(object, proto, 'class');
            dependencies = dependencies || {};

            if (dependencies.hasOwnProperty(doa_function.keywords[1])) {
                protectProperty(proto, 'parent', Object.create(doa_abstract.parseParentClass(dependencies[doa_function.keywords[1]])));
                parseProperties(object, Object.getPrototypeOf(proto.parent), 'parent');
            } else if (dependencies.hasOwnProperty(doa_function.keywords[2])) {
                require(['doa/interface'], function (doa_interface) {
                    doa_interface(object, dependencies[doa_function.keywords[2]]);
                });
            }
        },

        objectConstructor = function (name, object, dependencies) {
            var definition = (undefined === object) ? name : object,
                class_name = (undefined === object) ? 'anonymous' : name,

                constructor = function () {
                    var args = Array.prototype.slice.call(arguments),
                        dep = args.shift();
                    protectProperty(this, 'class', Object.create(definition));
                    parseObject(this, dep);

                    if (!Object.getPrototypeOf(this.class).hasOwnProperty(doa_function.keywords[0])) {
                        Object.getPrototypeOf(this.class).construct = function () {
                            return;
                        };
                    }
                    protectProperty(this, 'class_name', class_name);
                    Object.getPrototypeOf(this.class).construct.apply(this.class, args);

                    return this;
                };

            return constructor.bind(definition, dependencies);
        };

    return objectConstructor;
});
