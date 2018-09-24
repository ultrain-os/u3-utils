const assert = require('assert');
const U3Utils = require('../dist/lib/index');


describe('clone.test.js', () => {
    it('should clone the object', () => {
        const obj = {
            foo: 'bar'
        };
        const cloned = U3Utils.clone(obj);
        assert.equal(JSON.stringify(obj), JSON.stringify(cloned));
    });
});
