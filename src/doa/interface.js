define(function () {
    'use strict';

    var checkFunctionInterface = function (object, implemantation, interface_name, func_name) {
            if (object.hasOwnProperty(func_name)) {
                if (implemantation[func_name].length < object[func_name].length) {
                    throw interface_name + ' exception: object ' + object.class_name + ' to much parameters for function ' + func_name + '.';
                }
            } else {
                throw interface_name + ' exception: object' + object.class_name + ' does\'nt implement function ' + func_name + '.';
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