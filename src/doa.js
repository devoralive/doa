define(['require'], function (require) {
    'use strict';

    return {
        getDependencies: function (config) {
            var dependencies = {};
            if (config.bundles.doa && config.bundles.doa.interfaces) {
                dependency.interfaces = config.bundles.doa.interfaces;
                delete config.bundles.doa.interfaces;
            }

            return dependencies
        },

        init: function (doa_dep_name, dep_name, dep, config) {
            var DoaDep;

            if ('object' === doa_dep_name) {
                DoaDep = require('doa/' + doa_dep_name);
                return new DoaDep(dep_name, dep, this.getDependencies(config));
            } else if ('implement' === doa_dep_name) {
                config.bundles.doa = config.bundles.doa || {};
                config.bundles.doa.interfaces = config.bundles.doa.interfaces || {};

                config.bundles.doa.interfaces[dep_name] = dep;
            }
        },

        load: function (namespace, req, onload, config) {
            var parts = namespace.split(':'),
                doa_dep_name = parts.shift(),
                dep_name = parts.shift(),
                self = this;

            req([dep_name, 'doa/' + doa_dep_name], function (dep) {
                var result = self.init(doa_dep_name, dep_name, dep, config);

                onload(result);
            });
        }
    };
});