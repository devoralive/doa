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
