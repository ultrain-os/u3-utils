const assert = require('assert');
const U3Utils = require('../dist/lib/index');

describe('wait-forever.test.js', () => {
    it('should never resolve', async() => {
        let resolved = false;
        U3Utils
            .waitForever()
            .then(() => resolved = true);
        await U3Utils.wait(100);
        assert.equal(false, resolved);
    });
});
