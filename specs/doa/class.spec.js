define(['doa/class', 'specs/Class.mock', 'es5shim/es5-shim'], function (DoaClass, Mock) {
    'use strict';

    var ObjectConstructor = new DoaClass('specs/class.mock', Mock),

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

            expect(Instance !== InstanceTwo).toBe(true);

            expect(Instance.class_name).toBe('specs/class.mock');
        });

        it('Check function parsing', function () {
            expect(Instance.class.param).toBeUndefined();
            expect(typeof Instance.getParam).toBe('function');

            Instance.setParam('test');
            expect(Instance.getParam()).toBe('test');
        });
    });
});
