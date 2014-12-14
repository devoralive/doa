/*! doa - v0.0.1 */

/* src/doa.dist.js */
require.config({
    paths: {
        'doa/abstract': 'doa',
        'doa/class': 'doa',
        'doa/function': 'doa',
        'doa/interface': 'doa',
        'doa/trait': 'doa'
    }
});
/* src/doa.js */
define('doa', ['require'], function (require) {
    'use strict';

    var matches = {
        implement: 'interfaces',
        extend: 'extend',
        trait: 'trait'
    };

    return {
        getDependencies: function (config) {
            var dependencies = {};
            if (config.doa.interfaces) {
                dependencies.interfaces = config.doa.interfaces;
                delete config.doa.interfaces;
            }
            if (config.doa.extend) {
                dependencies.extend = config.doa.extend;
                delete config.doa.extend;
            }
            if (config.doa.trait) {
                dependencies.trait = config.doa.trait;
                delete config.doa.trait;
            }

            return dependencies;
        },

        initDependencies: function (action, dep_name, dep, config) {
            if ('implement' === action || 'extend' === action || 'trait' === action) {
                config.doa[matches[action]] = config.doa[matches[action]] || {};

                config.doa[matches[action]][dep_name] = dep;
            }
            return dep;
        },

        init: function (action, dep_name, dep, config) {
            var DoaClass;

            if ('class' === action) {
                DoaClass = require('doa/class');
                return new DoaClass(dep_name, dep, this.getDependencies(config));
            }
            this.initDependencies(action, dep_name, dep, config);

            return dep;
        },

        checkDoaPaths: function (paths) {
            if (undefined === paths['doa/class'] && paths['doa/class'] !== paths.doa) {
                var module_name;
                for (module_name in paths) {
                    if (paths.hasOwnProperty(module_name) && /doa\//.test(module_name)) {
                        paths[module_name] = paths.doa;
                    }
                }
            }
        },

        load: function (namespace, req, onload, config) {
            var parts = namespace.split(':'),
                action = parts.shift(),
                dependency_name = parts.shift(),
                self = this;

            self.checkDoaPaths(config.paths);
            config.doa = config.doa || {};
            req([dependency_name, 'doa/class'], function (dependency) {
                var result = self.init(action, dependency_name, dependency, config);

                onload(result);
            });
        }
    };
});

/* src/doa/abstract.js */
define('doa/abstract', ['doa/function'], function (doa_function) {
    'use strict';

    return {
        extendAbstract: function (object, proto, property_name) {
            if ('function' === typeof proto[property_name] && !object.hasOwnProperty(property_name)) {
                doa_function.bindFunction(object, object.class.parent, property_name);
            }
        },

        parseParentClass: function (extend) {
            var parent = {},
                parent_name;

            for (parent_name in extend) {
                if (extend.hasOwnProperty(parent_name)) {
                    parent = extend[parent_name];
                    parent.class_name = parent_name;
                    return parent;
                }
            }
        }
    };
});

/* src/doa/class.js */
define('doa/class', ['doa/function', 'doa/abstract', 'doa/trait'], function (doa_function, doa_abstract, doa_trait) {
    'use strict';

    var definePublicProperty = function (object, param_name) {
            Object.defineProperty(
                object,
                param_name,
                {
                    get: function () {
                        return object.class[param_name];
                    },
                    set: function (value) {
                        object.class[param_name] = value;
                    },
                    enumerable: true,
                    configurable: false
                }
            );
        },

        bindPublicParam = function (object, proto) {
            var param_name;
            for (param_name in proto.public) {
                if (proto.public.hasOwnProperty(param_name) && !proto.hasOwnProperty(param_name)) {
                    proto[param_name] = proto.public[param_name];
                    definePublicProperty(object, param_name);
                }
            }
        },

        parseProperties = function (object, proto, context) {
            var property_name;

            for (property_name in proto) {
                if (proto.hasOwnProperty(property_name)) {
                    if (context === 'parent') {
                        doa_abstract.extendAbstract(object, proto, property_name);
                    } else if (property_name === 'public') {
                        bindPublicParam(object, proto);
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
            var proto = Object.getPrototypeOf(object.class),
                parent;

            parseProperties(object, proto, 'class');
            dependencies = dependencies || {};

            if (dependencies.hasOwnProperty(doa_function.keywords[1])) {
                parent = doa_abstract.parseParentClass(dependencies[doa_function.keywords[1]]);
                protectProperty(object.class, 'parent', Object.create(parent));
                parseProperties(object, Object.getPrototypeOf(object.class.parent), 'parent');
            }
            if (dependencies.hasOwnProperty(doa_function.keywords[2])) {
                require(['doa/interface'], function (doa_interface) {
                    doa_interface(object, dependencies[doa_function.keywords[2]]);
                });
            }
            if (dependencies.hasOwnProperty(doa_function.keywords[3])) {
                doa_trait.parseTraits(object, proto, dependencies[doa_function.keywords[3]]);
            }
        },

        objectConstructor = function (name, object, dependencies) {
            var definition = ('string' === typeof name) ? object : name,
                class_name = ('string' === typeof name) ? name : 'anonymous',
                object_dependencies = ('string' === typeof name) ? dependencies : object,

                constructor = function () {
                    var args = Array.prototype.slice.call(arguments),
                        dep = args.shift();
                    protectProperty(this, 'class', Object.create(definition));
                    parseObject(this, dep);

                    if (!Object.getPrototypeOf(this.class).hasOwnProperty(doa_function.keywords[0])) {
                        Object.getPrototypeOf(this.class).construct = function () {
                            return this;
                        };
                    }
                    protectProperty(this, 'class_name', class_name);
                    Object.getPrototypeOf(this.class).construct.apply(this.class, args);

                    return this;
                };

            return constructor.bind(definition, object_dependencies);
        };

    return objectConstructor;
});

/* src/doa/function.js */
define('doa/function', function () {
    'use strict';

    return {
        keywords: ['construct', 'extend', 'interfaces', 'trait'],

        bindFunction: function (object, instance, function_name) {
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

        parseFunction: function (object, proto, property_name) {
            if (-1 === this.keywords.indexOf(property_name) && 'function' === typeof proto[property_name]) {
                this.bindFunction(object, object.class, property_name);
            }
        }
    };
});

/* src/doa/interface.js */
define('doa/interface', function () {
    'use strict';

    var checkFunctionInterface = function (object, implemantation, interface_name, func_name) {
            if (object.hasOwnProperty(func_name)) {
                if (implemantation[func_name].length < object[func_name].length) {
                    throw interface_name + ' exception: object ' + object.class_name + ' to much parameters for function ' + func_name + '.';
                }
            } else {
                throw interface_name + ' exception: object ' + object.class_name + ' doesn\'t implement function ' + func_name + '.';
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
        };

    return checkInterfaces;
});

/* src/doa/trait.js */
define('doa/trait', ['doa/function'], function (doa_function) {
    'use strict';

    return {
        bindTraitFunction: function (object, instance, trait) {
            var property_name;
            for (property_name in trait) {
                if (trait.hasOwnProperty(property_name) && !instance.hasOwnProperty(property_name) && 'function' === typeof trait[property_name]) {
                    instance[property_name] = trait[property_name];
                    doa_function.bindFunction(object, object.class, property_name);
                }
            }
        },

        parseTraits: function (object, instance, traits) {
            var trait_name;

            for (trait_name in traits) {
                if (traits.hasOwnProperty(trait_name)) {
                    this.bindTraitFunction(object, instance, traits[trait_name]);
                }
            }
        }
    };
});
