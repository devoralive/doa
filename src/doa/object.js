define(function () {
    'use strict';

    var keywords = ['construct', 'interfaces', 'extend'],

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

        checkFunctionInterface = function (object, implemantation, interface_name, func_name) {
            if (object.hasOwnProperty(func_name)) {
                if (implemantation[func_name].length !== object[func_name].length) {
                    throw 'InterfacesExepction ' + interface_name + ': object ' + object.getClassName() + ' function ' + func_name + ' bad parameters number.';
                }
            } else {
                throw 'InterfacesExepction ' + interface_name + ': object' + object.getClassName() + ' does\'nt implement function ' + func_name + '.';
            }
        },

        checkInterface = function (object, interface_name, implemantation) {
            var func_name;
            for (func_name in implemantation) {
                if (implemantation.hasOwnProperty(func_name) && 'function' === typeof implemantation[func_name]) {
                    checkFunctionInterface(object, implemantation, interface_name, func_name);
                }
            }
        },

        checkInterfaces = function (object, interfaces) {
            var interface_name;
            for (interface_name in interfaces) {
                if (interfaces.hasOwnProperty(interface_name)) {
                    checkInterface(object, interface_name, interfaces[interface_name]);
                }
            }
        },

        extendObjects = function () {
            return;
        },

        parseProperty = function (object, property) {
            if (-1 === keywords.indexOf(property) && 'function' === typeof Object.getPrototypeOf(object.class)[property]) {
                bindFunction(object, property);
            } else if (property === keywords[1]) {
                checkInterfaces(Object.getPrototypeOf(object.class), Object.getPrototypeOf(object.class)[property]);
            } else if (property === keywords[2]) {
                extendObjects();
            }
        },

        parseObject = function (object) {
            var property;
            for (property in Object.getPrototypeOf(object.class)) {
                if (Object.getPrototypeOf(object.class).hasOwnProperty(property)) {
                    parseProperty(object, property);
                }
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

                    Object.getPrototypeOf(this.class).construct.apply(this.class, arguments);

                    return this;
                };

            if (dependencies && dependencies.interfaces) {
                instance.interfaces = dependencies.interfaces;
            }

            instance.getClassName = function () {
                return class_name;
            };

            return constructor.bind(instance);
        };

    return objectConstructor;
});
