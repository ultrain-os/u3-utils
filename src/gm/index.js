const commonApi = require('./api_common');
const PrivateKey = require("./private_key")
const PublicKey = require("./public_key")
const Signature = require("./signature")
const key_utils = require("./key_utils")

const gm = Object.assign({}, commonApi, {PrivateKey, PublicKey, Signature, key_utils})

module.exports = gm;