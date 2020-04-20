const {gm} = require('../../index');
const assert = require('assert');
// const cipherMode = 1; // 1 - C1C3C2，0 - C1C2C3

// const msgString = 'abcdefghABCDEFGH12345678abcdefghABCDEFGH12345678abcdefghABCDabcdefghABCDEFGH12345678abcdefghABCDEFGH12345678abcdefghABCDabcdefghABCDEFGH12345678abcdefghABCDEFGH12345678abcdefghABCDabcdefghABCDEFGH12345678abcdefghABCDEFGH12345678abcdefghABCDabcdefghABCDEFGH';
const msgString = 'absasdagfadgadsfdfdsf';

describe("gm api test", () => {
    let objWithMnemonic;

    it("generateKeyPairHex", () => {
        let keypair = gm.generateKeyPairHex();

        let publicKey = keypair.publicKey;
        let privateKey = keypair.privateKey;
        assert.equal(publicKey.length, 130, "public key length mismatch");
        assert.equal(privateKey.length, 64, "length of private key mismatch.");
    })

    it("generateKeyPairWithMnemonic", () => {
        let pwm = gm.generateKeyPairWithMnemonic();
        objWithMnemonic = pwm;
        console.log(pwm.privateKey);
        assert.equal(pwm.publicKey.length, 130, "public key length mismatch");
        assert.equal(pwm.privateKey.length, 64, "length of private key mismatch.");
    })

    it("generateKeyPairByMnemonic", () => {
        let pbm = gm.generateKeyPairByMnemonic(objWithMnemonic.mnemonic);
        assert.equal(pbm.publicKey, objWithMnemonic.publicKey, 'generateKeyPairByMnemonic public key mismatch');
        assert.equal(pbm.privateKey, objWithMnemonic.privateKey, 'generateKeyPariByMnemonic private key mismatch');
    })

    it("sign and verify", () => {
        let sigValueHex = gm.sign(msgString, objWithMnemonic.privateKey);
        let verifyResult = gm.verify(sigValueHex, msgString, objWithMnemonic.publicKey);
        assert.ok(verifyResult, "verify and sign failed.");
    })

    it("signHash and verify Hash", () => {
        let sigValueHex4 = gm.signHash(msgString, objWithMnemonic.privateKey);
        let verifyResult4 = gm.verifyHash(sigValueHex4, msgString, objWithMnemonic.publicKey);
        assert.ok(verifyResult4, 'vefifhHasn and signHash failed.');
    })
})
