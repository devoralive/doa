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

        parseObject = function (object) {
            var proto = Object.getPrototypeOf(object.class);
            parseProperties(object, proto, 'class');

            if (proto.hasOwnProperty('parent')) {
                protectProperty(object.class, 'parent', Object.create(proto.parent));
                parseProperties(object, proto.parent, 'parent');
            } else if (proto.hasOwnProperty(doa_function.keywords[2])) {
                require(['doa/interface'], function (doa_interface) {
                    doa_interface(object, proto[doa_function.keywords[2]]);
                });
            }
        },

        addObjectDependencies = function (instance, dependencies) {
            if (dependencies && dependencies.interfaces) {
                instance.interfaces = dependencies.interfaces;
            }

            if (dependencies && dependencies.extend) {
                instance.parent = doa_abstract.parseParentClass(dependencies.extend);
            }
        },

        objectConstructor = function (name, object, dependencies) {
            var instance = (undefined === object) ? name : object,
                class_name = (undefined === object) ? 'anonymous' : name,

                constructor = function () {
                    protectProperty(this, 'class', Object.create(instance));
                    parseObject(this);

                    if (!Object.getPrototypeOf(this.class).hasOwnProperty(doa_function.keywords[0])) {
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
