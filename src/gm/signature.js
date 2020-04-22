const assert = require("assert");
const keyUtils = require("./key_utils");
const PrivateKey = require("./private_key");
const PublicKey = require('./public_key');
const sm2impl = require('./sm2');
const hash = require('./hash');

module.exports = Signature;

function Signature(sm2signature) {
    assert.equal(typeof sm2signature, 'string', 'SM2 signature must be string.');

    function verify(data, pubkey, encoding = "utf8") {
        assert.equal(typeof data, "string", 'data to verify must be string.');
        let rawPub = PublicKey.fromString(pubkey).toUncompressed();
        let hashedData = hash.sha256(data);
        return sm2impl.doVerifySignature(hashedData, sm2signature, rawPub);
    }

    function verifyHash(data, pubkey, encoding = "utf8") {
        assert.equal(typeof data, "string", 'data to verifyHash must be string.');
        let rawPub = PublicKey.fromString(pubkey).toUncompressed();
        let hashedData = hash.sha256(data);
        return sm2impl.doVerifySignature(hashedData, sm2signature, rawPub, { hash: true });
    };

    function recover(data, encoding = "utf8") {
        throw new Error('Signature.recover is not implemented.');
    };

    function recoverHash(dataSha256, encoding = "hex") {
        throw new Error('Signature.recoverHash is not implemented.');
    };

    function toBuffer() {
        let buf = Buffer.alloc(65);
        let sbuf = Buffer.from(sm2signature, 'hex');
        // 魔幻数字33, 算法中规定可以自由选择32~35之间的数
        // 不要随意改动, 它和节点上验证签名的设置相一致.
        buf.writeUInt8(33, 0);
        sbuf.copy(buf, 1);
        return buf;
    };

    function toHex() {
        return toBuffer().toString("hex");
    };

    let signatureCache;

    function toString() {
        if (signatureCache) {
            return signatureCache;
        }
        signatureCache = "SIG_GM_" + keyUtils.checkEncode(toBuffer(), "GM");
        return signatureCache;
    }

    return {
        toBuffer,
        verify,
        verifyHash,
        recover,
        recoverHash,
        toHex,
        toString
    };
}

Signature.sign = function (data, privateKey, encoding = "utf8") {
    let rawPrivateKey = PrivateKey.rawSm2PrivateKey(privateKey);
    let hashStr = hash.sha256(data);
    let signature = sm2impl.doSignature(hashStr, rawPrivateKey);

    return Signature(signature);
};

Signature.signHash = function (data, privateKey, encoding = "utf8") {
    // TODO: to check should data.encoding === encoding
    let rawPrivateKey = PrivateKey.rawSm2PrivateKey(privateKey);
    let rawPublicKey = PrivateKey.rawSm2PublicKey(privateKey);
    let hashStr = hash.sha256(data);
    let signature = sm2impl.doSignature(hashStr, rawPrivateKey, { hash: true, publicKey: rawPublicKey });
    return Signature(signature);
};

Signature.fromString = function (signature) {
    try {
        return Signature.fromStringOrThrow(signature);
    } catch (e) {
        return null;
    }
};

Signature.fromStringOrThrow = function (signature) {
    assert(typeof signature, "string", "signature");
    const match = signature.match(/^SIG_([A-Za-z0-9]+)_([A-Za-z0-9]+)$/);
    assert(match != null && match.length === 3, "Expecting signature like: SIG_GM_base58signature..");
    const [, keyType, keyString] = match;
    assert.equal(keyType, "GM", "GM signature expected");
    let sm2signature = keyUtils.checkDecode(keyString, keyType).toString('hex').slice(2);
    return Signature(sm2signature);
};

Signature.from = (o) => {
    return Signature.fromString(o);
  };
