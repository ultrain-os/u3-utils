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
    return "GCF" + keyUtils.checkEncode(toBuffer());
  }

  function toUncompressed () {
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
  while (Array.isArray(text.keys) && text.keys.length) {
    text = text.keys[0].key
  }
  
  if (/^GCF/.test(text)) {
    let public_key = text.substring(3);
    let s = keyUtils.checkDecode(public_key);
    return PublicKey(s.toString('hex'));
  }

  throw new Error(`${text} is invalid, public key must start with 'GCF'.`);
}

PublicKey.fromBuffer = function(pubbuf) {
  let s = pubbuf.toString('hex');
  return PublicKey(s);
}

PublicKey.fromStringOrThrow = function(public_key) {
  if (Array.isArray(public_key.keys) && public_key.keys.length) {
    public_key = public_key.keys[0].key
  }
  
  assert(typeof public_key, "string", "public_key");
  const match = public_key.match(/^PUB_([A-Za-z0-9]+)_([A-Za-z0-9]+)$/);
  if (match === null) {
    // legacy
    if (/^GCF/.test(public_key)) {
      public_key = public_key.substring(3);
    }
  } else {
    throw new Error('PublicKey.fromStringOrThrow not supoort this type of public key.');
  }
}
