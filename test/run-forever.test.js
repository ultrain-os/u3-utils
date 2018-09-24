const assert = require('assert');
const U3Utils = require('../dist/lib/index');

describe('run-forever.test.js', () => {
    it('should run forever', async() => {
        let t = 0;
        const pred = () => t++;
        U3Utils.runForever(pred, 10);

        await U3Utils.wait(100);
        assert.ok(t > 4);
        const lastT = t;
        await U3Utils.wait(100);
        assert.ok(t > lastT);
    });
});
