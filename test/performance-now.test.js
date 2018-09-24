const assert = require('assert');
const U3Utils = require('../dist/lib/index');

describe('performance-now.test.js', () => {
    it('should return a number', () => {
        const now = U3Utils.performanceNow();
        assert.equal(typeof now, 'number');
    });

    it('should return a higher number later', async () => {
        const now1 = U3Utils.performanceNow();
        await U3Utils.wait(50);
        const now2 = U3Utils.performanceNow();
        assert.ok(now1 < now2);
    });
});
