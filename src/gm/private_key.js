const assert = require("assert");
const BigInteger = require("bigi");
const hash = require("./hash");
const PublicKey = require("./public_key");
const keyUtils = require("./key_utils");
const sm2impl = require('./sm2');

module.exports = PrivateKey;

function PrivateKey(d) {
    if (typeof d === "string") {
        return PrivateKey.fromString(d);
    } else if (Buffer.isBuffer(d)) {
        return PrivateKey.fromBuffer(d);
    }
    else if (typeof d === "object" && BigInteger.isBigInteger(d.d)) {
        return PrivateKey(d.d);
    }

    if (!BigInteger.isBigInteger(d)) {
        throw new TypeError("Invalid private key");
    }

    function toString() {
        return toWif();
    }

    function toWif() {
        var private_key = toBuffer();
        // checksum includes the version
        private_key = Buffer.concat([Buffer.from([0x80]), private_key]);
        return keyUtils.checkEncode(private_key, "sha256x2");
    }

    let public_key;

    function toPublic() {
        if (public_key) {
            // cache
            // S L O W in the browser
            return public_key;
        }

        let seed = d;
        if (BigInteger.isBigInteger(d)) {
            seed = d.toString(16);
        }
        const pub = sm2impl.generatePublicKeyFromPrivateKey(seed);
        return public_key = PublicKey(pub).toString();
    }

    function toBuffer() {
        return d.toBuffer(32);
    }

    function getSharedSecret(public_key) {
        throw new Error('"getSharedSecret" is not implemented by sm2.');
    }

    function getChildKey(name) {
        throw new Error('"getChildKey" is not implemented by sm2.');
    }

    function toHex() {
        return toBuffer().toString("hex");
    }

    return {
        d,
        toWif,
        toString,
        toPublic,
        toBuffer,
        getSharedSecret,
        getChildKey,
    };
}

function parseKey(privateStr) {
    assert(typeof privateStr, "string", "privateStr");
    const match = privateStr.match(/^PVT_([A-Za-z0-9]+)_([A-Za-z0-9]+)$/);

    if (match === null) {
        // legacy WIF - checksum includes the version
        const versionKey = keyUtils.checkDecode(privateStr, "sha256x2");
        const version = versionKey.readUInt8(0);
        assert.equal(0x80, version, `Expected version ${0x80}, instead got ${version}`);
        const privateKey = PrivateKey.fromBuffer(versionKey.slice(1));
        const keyType = "GM";
        const format = "WIF";
        return { privateKey, format, keyType };
    }

    assert(match.length === 3, "Expecting private key like: PVT_GM_base58privateKey..");
    const [, keyType, keyString] = match;
    assert.equal(keyType, "GM", "GM private key expected");
    const privateKey = PrivateKey.fromBuffer(keyUtils.checkDecode(keyString, keyType));
    return { privateKey, format: "PVT", keyType };
}

PrivateKey.fromHex = function (hex) {
    return PrivateKey.fromBuffer(Buffer.from(hex, "hex"));
};

PrivateKey.fromBuffer = function (buf) {
    if (!Buffer.isBuffer(buf)) {
        throw new Error("Expecting parameter to be a Buffer type");
    }
    if (buf.length === 33 && buf[32] === 1) {
        // remove compression flag
        buf = buf.slice(0, -1);
    }
    if (32 !== buf.length) {
        throw new Error(`Expecting 32 bytes, instead got ${buf.length}`);
    }
    return PrivateKey(BigInteger.fromBuffer(buf));
};

PrivateKey.fromSeed = function (seed) { // generate_private_key
    if (!(typeof seed === "string")) {
        throw new Error("seed must be of type string");
    }
    let hashedSeed = hash.sha256(seed, 'hex');
    let keys = sm2impl.generateKeyPairHexBySeed(hashedSeed, false);

    return PrivateKey(Buffer.from(keys.privateKey, 'hex'));
};

PrivateKey.isWif = function (text) {
    try {
        assert(parseKey(text).format === "WIF");
        return true;
    } catch (e) {
        return false;
    }
};

PrivateKey.isValid = function (key) {
    try {
        PrivateKey(key);
        return true;
    } catch (e) {
        return false;
    }
};

PrivateKey.fromString = function (privateStr) {
    return parseKey(privateStr).privateKey;
};

PrivateKey.rawSm2PrivateKey = function (wif) {
    assert(typeof wif, "string", "wif must be string");
    // legacy WIF - checksum includes the version
    const versionKey = keyUtils.checkDecode(wif, "sha256x2");
    const version = versionKey.readUInt8(0);
    assert.equal(0x80, version, `Expected version ${0x80}, instead got ${version}`);
    let rawpriv = versionKey.slice(1).toString('hex');
    return rawpriv;
}

PrivateKey.rawSm2PublicKey = function (wif) {
    let rawpriv = PrivateKey.rawSm2PrivateKey(wif);
    let pub = sm2impl.generatePublicKeyFromPrivateKey(rawpriv, false);
    return pub;
}


function initialize() {
    // 保留这个方法, 保证在API上和ECC一致
}

PrivateKey.initialize = initialize;
