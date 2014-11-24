define(['require', 'doa/object'], function (require) {
    'use strict';

    return {
        getDependencies: function (config) {
            var dependencies = {};
            if (config.doa.interfaces) {
                dependencies.interfaces = config.doa.interfaces;
                delete config.doa.interfaces;
            }

            return dependencies;
        },

        init: function (doa_dep_name, dep_name, dep, config) {
            var DoaDep;

            if ('object' === doa_dep_name) {
                DoaDep = require('doa/object');
                return new DoaDep(dep_name, dep, this.getDependencies(config));
            }
            if ('implement' === doa_dep_name) {
                config.doa.interfaces = config.doa.interfaces || {};

                config.doa.interfaces[dep_name] = dep;
            }
        },

        load: function (namespace, req, onload, config) {
            var parts = namespace.split(':'),
                doa_dep_name = parts.shift(),
                dep_name = parts.shift(),
                self = this;

            config.doa = config.doa || {};
            req([dep_name], function (dep) {
                var result = self.init(doa_dep_name, dep_name, dep, config);

                onload(result);
            });
        }
    };
});