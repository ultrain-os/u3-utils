const assert = require('assert');
const U3Utils = require('../dist/lib/index');

describe('resolve-values.test.js', () => {
    it('resolve all values', async () => {
        const resolved = await U3Utils.resolveValues({
            a: U3Utils.wait(1).then(() => 'a'),
            b: U3Utils.wait(10).then(() => 'b'),
            c: U3Utils.wait(100).then(() => 'c')
        });
        Object.values(resolved).forEach(val => {
            assert.equal(val.then, undefined);
        });
        assert.equal(resolved.a, 'a');
        assert.equal(resolved.b, 'b');
        assert.equal(resolved.c, 'c');
    });
    it('should be possible to destruct the result', async () => {
        const {
            a,
            b,
            c
        } = await U3Utils.resolveValues({
            a: U3Utils.wait(1).then(() => 'a'),
            b: U3Utils.wait(1).then(() => 'b'),
            c: U3Utils.wait(1).then(() => 'c')
        });
        assert.equal(a, 'a');
        assert.equal(b, 'b');
        assert.equal(c, 'c');
    });
    it('should work if non-promise is passed', async () => {
        const {
            a,
            b,
            c
        } = await U3Utils.resolveValues({
            a: U3Utils.wait(1).then(() => 'a'),
            b: 'b',
            c: U3Utils.wait(1).then(() => 'c')
        });
        assert.equal(a, 'a');
        assert.equal(b, 'b');
        assert.equal(c, 'c');
    });
    it('should crash if promise catches', async () => {
        const throwOne = async function() {
            await U3Utils.wait(10);
            throw new Error('foobar');
        };
        await U3Utils.assertThrows(
            () => U3Utils.resolveValues({
                a: U3Utils.wait(1).then(() => 'a'),
                b: throwOne(),
                c: U3Utils.wait(1).then(() => 'c')
            }),
            Error,
            'foobar'
        );
    });
});
