define('doa/abstract', ['doa/function'], function (doa_function) {
    'use strict';

    return {
        extendAbstract: function (object, proto, property_name) {
            if ('function' === typeof proto[property_name] && !object.hasOwnProperty(property_name)) {
                doa_function.bindFunction(object, object.blueprint.parent, property_name);
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
