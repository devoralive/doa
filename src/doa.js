define(['require', 'doa/class'], function (require) {
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

            return dependencies;
        },

        init: function (action, dep_name, dep, config) {
            var DoaClass;

            if ('class' === action) {
                DoaClass = require('doa/class');
                return new DoaClass(dep_name, dep, this.getDependencies(config));
            }
            if ('implement' === action || 'extend' === action) {
                config.doa[matches[action]] = config.doa[matches[action]] || {};

                config.doa[matches[action]][dep_name] = dep;
            }
            return dep;
        },

        load: function (namespace, req, onload, config) {
            var parts = namespace.split(':'),
                action = parts.shift(),
                dependency_name = parts.shift(),
                self = this;

            config.doa = config.doa || {};
            req([dependency_name], function (dependency) {
                var result = self.init(action, dependency_name, dependency, config);

                onload(result);
            });
        }
    };
});