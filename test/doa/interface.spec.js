define(['doa/interface', 'test/interface.mock', 'es5shim/es5-shim'], function (doa_interface, MockInterface) {
    'use strict';

    var mock = {
        class_name :  'class_name',

        getParam: function (param) {
            return param;
        }
    };

    describe('Interface Spec.', function () {
        it('Check object interface missing function.', function () {
            try {
                doa_interface({class_name :  'class_name'}, {MockInterface: MockInterface});
                expect('Exception was raising').toBe(true);
            } catch (e) {
                expect(e).toBe('MockInterface' + ' exception: object ' + 'class_name' + ' doesn\'t implement function ' + 'getParam' + '.');
            }
        });

        it('Check object interface to many parameters.', function () {
            try {
                doa_interface(mock, {MockInterface: MockInterface});
                expect('Exception was raising').toBe(true);
            } catch (e) {
                expect(e).toBe('MockInterface' + ' exception: object ' + 'class_name' + ' to much parameters for function ' + 'getParam' + '.');
            }
        });
    });
});
