define(['doa/class', 'doa/interface', 'specs/class.mock', 'specs/abstract.mock', 'es5shim/es5-shim'], function (DoaClass, doa_interface, MockClass, MockAbstract) {
    'use strict';

    var MockConstructor = new DoaClass('specs/class.mock', MockClass, {extend: {'specs/abstract.mock': MockAbstract}}),
        MockInstance = new MockConstructor(),
        MockInterface = {
            setAbstractParam: function (param) {
                return param;
            }
        };


    describe('Abstract Spec', function () {
        it('check object abstract binding function', function () {
            expect(typeof MockInstance.setAbstractParam).toBe('function');
        });

        it('check object parent acessor', function () {
            expect(MockInstance.class.parent.abstract_param).toBeUndefined();
            MockInstance.setAbstractParam('parent param');

            expect(MockInstance.class.parent.abstract_param).toBe('parent param');
            expect(MockInstance.getAbstractParam()).toBe('parent param');
        });

        it('check object abstract and interface validation', function () {
            try {
                doa_interface(MockInstance, {MockInterface: MockInterface});
                expect(true).toBe(true);
            } catch (e) {
                expect(e).toBe(false);
            }
        });

        it('check that the two instances have differents parents', function () {
            var MockInstanceTwo = new MockConstructor();
            MockInstance.setAbstractParam('parent param second time');

            expect(MockInstanceTwo.class.parent.abstract_param).toBeUndefined();
            expect(MockInstance.getAbstractParam()).toBe('parent param second time');
        });
    });
});