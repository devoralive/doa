define(['doa/class', 'specs/class.mock', 'es5shim/es5-shim'], function (DoaClass, Mock) {
    'use strict';

    var ObjectConstructor = new DoaClass('specs/class.mock', Mock),
        Instance = new ObjectConstructor('test on construct'),
        InstanceTwo = new ObjectConstructor('test on other construct');

    describe('Object Spec.', function () {
        it('Check that public param is accessible.', function () {
            expect(Instance.public_param).toBe('public param');
        });

        it('Check that public param is whit this.', function () {
            Instance.setPublicParam('param');
            expect(Instance.public_param).toBe('param');
        });

        it('Check that public param are not share in the two Instance.', function () {
            expect(InstanceTwo.public_param).toBe('public param');
        });
    });
});