define(['doa/function'], function (doa_function) {
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
