const assert = require('assert');
const U3Utils = require('../dist/lib/index');


describe('wait-resolveable.test.js', () => {
    it('should wait time is over', async() => {
        await U3Utils.waitResolveable(100);
    });
    it('should wait until manually resolved', async() => {
        let resolved = null;
        const waiter = U3Utils.waitResolveable(10000);
        waiter.promise.then(x => {
            resolved = x;
        });
        waiter.resolve('foobar');
        await U3Utils.wait();
        assert.equal('foobar', resolved);
    });
});
