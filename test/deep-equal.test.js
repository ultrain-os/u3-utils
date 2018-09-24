const assert = require('assert');
const U3Utils = require('../dist/lib/index');


describe('deep-equal.test.js', () => {
    it('should be equal', () => {
        const obj = {
            foo: 'bar',
            nested: {
                foo: 'bar'
            }
        };
        const obj2 = {
            foo: 'bar',
            nested: {
                foo: 'bar'
            }
        };
        assert.ok(U3Utils.deepEqual(obj, obj2));
    });
    it('should not be equal', () => {
        const obj = {
            foo: 'bar'
        };
        const obj2 = {
            foo: 'bar',
            nested: {
                foo: 'bar'
            }
        };
        assert.equal(false, U3Utils.deepEqual(obj, obj2));
    });
});
