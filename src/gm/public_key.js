const assert = require("assert");
const keyUtils = require("./key_utils");
const sm2impl = require('./sm2');

module.exports = PublicKey;

function PublicKey (Q) {
  PublicKey.fromStringOrThrow(Q);

  function toBuffer () {
    return Buffer.from(Q, 'hex');
  }

  /** @todo rename to toStringLegacy */
  function toString () {
    return "UTR" + keyUtils.checkEncode(toBuffer());
  }

  function toUncompressed () {
    console.log(`PublicKey.toUncompressed Q: ${Q}`);
    return sm2impl.getRawPublicKeyFromCompressedPubicKey(Q);
    // throw new Error('"toUncompressed" is not supported by sm2.');
  }

  function toHex () {
    return toBuffer().toString("hex");
  }

  return {
    Q,
    toString,
    toUncompressed,
    toHex,
    toBuffer,
  };
}

PublicKey.isValid = function(text) {
  try {
    PublicKey(text);
    return true;
  } catch (e) {
    return false;
  }
}

PublicKey.fromString = function(text) {
  if (/^UTR/.test(text)) {
    let public_key = text.substring(3);
    let s = keyUtils.checkDecode(public_key);
    return PublicKey(s.toString('hex'));
  }

  throw new Error(`${text} is invalid, public key must start with 'UTR'.`);
}

PublicKey.fromBuffer = function(pubbuf) {
  let s = pubbuf.toString('hex');
  return PublicKey(s);
}

PublicKey.fromStringOrThrow = function(public_key) {
  assert(typeof public_key, "string", "public_key");
  const match = public_key.match(/^PUB_([A-Za-z0-9]+)_([A-Za-z0-9]+)$/);
  if (match === null) {
    // legacy
    if (/^UTR/.test(public_key)) {
      public_key = public_key.substring(3);
    }
  } else {
    throw new Error('PublicKey.fromStringOrThrow not supoort this type of public key.');
  }
}
