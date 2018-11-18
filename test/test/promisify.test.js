const assert = require('assert');
const U3Utils = require('../../src/test/index');


describe('promisify.test.js', () => {
    it('should return a promise', () => {
        const ret = U3Utils.promisify('foobar');
        assert.ok(ret instanceof Promise);
    });
    it('should not crash when undefined given', () => {
        const ret = U3Utils.promisify(undefined);
        assert.ok(ret instanceof Promise);
    });
});
