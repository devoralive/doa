define(['doa/class', 'test/class.mock', 'es5shim/es5-shim'], function (DoaClass, Mock) {
    'use strict';

    var ObjectConstructor = new DoaClass('test/class.mock', Mock),
        Instance = new ObjectConstructor('test on construct'),
        InstanceTwo = new ObjectConstructor('test on other construct');


    describe('Object Spec.', function () {
        it('Check object creation.', function () {
            expect(typeof ObjectConstructor).toBe('function');
        });

        it('Check new instance creation.', function () {
            expect(typeof Instance).toBe('object');
            expect(Instance.param).toBeUndefined();
            expect(Instance.class_name).toBe('test/class.mock');
        });

        it('Check function parsing.', function () {
            expect(Instance.blueprint.param).toBeUndefined();
            expect(typeof Instance.getParam).toBe('function');

            Instance.setParam('test');
            expect(Instance.getParam()).toBe('test');
            expect(InstanceTwo.getParam()).toBe(undefined);
        });

        it('Check that the two instances are differents.', function () {
            expect(Instance.blueprint.paramOnConstruct).toBe('test on construct');
            expect(InstanceTwo.blueprint.paramOnConstruct).toBe('test on other construct');

            expect(Instance !== InstanceTwo).toBe(true);
        });
    });
});
