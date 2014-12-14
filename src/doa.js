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
