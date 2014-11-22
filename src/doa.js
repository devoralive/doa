define(['require'], function (require) {
    'use strict';

    return {
        init: function (doa_dep_name, dep_name, dep) {
            var DoaDep = require(doa_dep_name);

            if ('doa/object' === doa_dep_name) {
                return new DoaDep(dep_name, dep);
            }
        },

        load: function (namespace, req, onload) {
            var parts = namespace.split(':'),

                doa_dep_name = 'doa/' + parts.shift(),

                dep_name = parts.shift(),

                self = this;

            req([dep_name, doa_dep_name], function (dep) {
                var depenedency = self.init(doa_dep_name, dep_name, dep);

                onload(depenedency);
            });
        }
    };
});