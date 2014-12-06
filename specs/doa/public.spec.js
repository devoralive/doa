define(['doa/class', 'specs/class.mock', 'es5shim/es5-shim'], function (DoaClass, Mock) {
    'use strict';
    var ObjectConstructor = new DoaClass('specs/class.mock', Mock),
        Instance = new ObjectConstructor(),
        InstanceTwo = new ObjectConstructor();

    xdescribe('Object public param Spec. This Spec don\'t work in node https://github.com/es-shims/es5-shim/issues#issue/5', function () {
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