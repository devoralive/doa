define(['doa/object', 'specs/object.mock', 'es5shim/es5-shim'], function (DoaObject, Mock) {
    'use strict';

    var ObjectConstructor = new DoaObject('specs/object.mock', Mock),
        Instance = new ObjectConstructor('test on construct'),
        InstanceTwo = new ObjectConstructor('test on other construct');

    describe('Object Spec', function () {
        it('Check object creation', function () {
            expect(typeof ObjectConstructor).toBe('function');
        });

        it('Check new instance creation', function () {
            expect(typeof Instance).toBe('object');
            expect(Instance.param).toBeUndefined();
            expect(Instance.class.paramOnConstruct).toBe('test on construct');
            expect(InstanceTwo.class.paramOnConstruct).toBe('test on other construct');
        });

        it('Check function parsing', function () {
            expect(Instance.class.param).toBeUndefined();
            expect(typeof Instance.getParam).toBe('function');
            Instance.setParam('test');
            expect(Instance.getParam()).toBe('test');
        });
    });
});
