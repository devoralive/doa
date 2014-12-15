define(['doa', 'doa/class'], function (doa, DoaClass) {
    'use strict';

    var mock = {
            class_name :  'class_name',

            getParam: function (param) {
                return param;
            }
        },

        config = {
            doa: {}
        };

    describe('doa Spec.', function () {
        it('Check object init.', function () {
            var ObjectConstructor = doa.init('class', 'MockClass', mock, config);

            expect(Object.getPrototypeOf(ObjectConstructor)).toBe(Object.getPrototypeOf(new DoaClass(mock)));
        });

        it('Retrieve depencies.', function () {
            var dep,
                it = {ITest: {}};

            config.doa = {
                interfaces: it,
                extend: {ATest: {}},
                trait: {TTest: {}}
            };

            dep = doa.getDependencies(config);
            expect(undefined === config.doa.interfaces).toBe(true);
            expect(undefined === config.doa.extend).toBe(true);
            expect(undefined === config.doa.trait).toBe(true);

            expect(dep.interfaces).toBe(it);
        });
    });
});
