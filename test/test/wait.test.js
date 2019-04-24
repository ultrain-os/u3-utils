const assert = require('assert');
const U3Utils = require('../../src/test/index');


describe('wait.test.js', () => {
    it('should wait', async() => {
        let val = 0;
        U3Utils.wait(2000).then(() => val = 1);
        assert.equal(0, val);
        await new Promise(res => {
            setTimeout(() => {
                assert.equal(val, 1);
                res();
            }, 400);
        });
    });
});
