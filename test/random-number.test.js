const assert = require('assert');
const U3Utils = require('../dist/lib/index');

describe('random-number.test.js', () => {
    it('should create a random number', () => {
        const nr = U3Utils.randomNumber();
        assert.equal(typeof nr, 'number');
        assert.ok(nr >= 0);
        assert.ok(nr <= 100000);
    });

    it('should respect the range', () => {
        // do many times to be sure sucess is not random
        let t = 0;
        while (t < 1000) {
            const nr = U3Utils.randomNumber(100, 150);
            assert.ok(nr >= 100);
            assert.ok(nr <= 150);
            t++;
        }
    });
});
