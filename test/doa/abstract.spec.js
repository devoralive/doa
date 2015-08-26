define(['doa/class', 'doa/interface', 'test/class.mock', 'test/abstract.mock', 'es5shim/es5-shim'], function (DoaClass, doa_interface, MockClass, MockAbstract) {
    'use strict';

    var MockConstructor = new DoaClass('test/class.mock', MockClass, {extend: {'test/abstract.mock': MockAbstract}}),
        MockInstance = new MockConstructor(),
        MockInterface = {
            setAbstractParam: function (param) {
                return param;
            }
        };

    describe('Abstract Spec.', function () {
        it('Check object abstract binding function.', function () {
            expect(typeof MockInstance.setAbstractParam).toBe('function');
        });

        it('Check object parent acessor.', function () {
            expect(MockInstance.blueprint.parent.abstract_param).toBeUndefined();
            MockInstance.setAbstractParam('parent param');

            expect(MockInstance.blueprint.parent.abstract_param).toBe('parent param');
            expect(MockInstance.getAbstractParam()).toBe('parent param');
        });

        it('Check object abstract and interface validation.', function () {
            try {
                doa_interface(MockInstance, {MockInterface: MockInterface});
                expect(true).toBe(true);
            } catch (e) {
                expect(e).toBe(false);
            }
        });

        it('Check that the two instances have differents parents.', function () {
            var MockInstanceTwo = new MockConstructor();
            MockInstance.setAbstractParam('parent param second time');

            expect(MockInstanceTwo.blueprint.parent.abstract_param).toBeUndefined();
            expect(MockInstance.getAbstractParam()).toBe('parent param second time');
        });
    });
});