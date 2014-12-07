define(['doa/class', 'test/class.mock', 'test/trait.mock', 'es5shim/es5-shim'], function (DoaClass, Mock, trait) {
    'use strict';

    var ObjectConstructor = new DoaClass('test/class.mock', Mock, {trait: {mocktrait: trait}}),
        Instance = new ObjectConstructor();


    describe('Trait Spec.', function () {
        it('Check trait function.', function () {
            Instance.setParam('world');
            expect(Instance.sayHello()).toBe('Hello world');
            expect(Instance.sayHelloFunction()).toBe('Hello world');
        });
    });
});