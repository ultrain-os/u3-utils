// let gm = require('./src/gm');

// console.log('generateKeyPairHex: ');
// let m = gm.generateKeyPairHex();
// console.log(JSON.stringify(m));

// console.log('generateKeyPairHexByMnemonic: ');
// m = gm.generateKeyPairByMnemonic(m.mnemonic);
// console.log(JSON.stringify(m));

// console.log('generateKeyPairHexWithMnemonic: ');
// m = gm.generateKeyPairWithMnemonic();
// console.log(JSON.stringify(m));

// const msg = 'abc';
// let signature = gm.sign(msg, 'D8C2FCAC2EF69C732CC6F7892267A03618E11BAC2990B2F2FC1B14CF27445718');
// console.log(`signature: ${signature}`);

// let pub = gm.getPublicKeyFromPrivateKey('D8C2FCAC2EF69C732CC6F7892267A03618E11BAC2990B2F2FC1B14CF27445718');
// console.log('public: ', pub);

// let verifyResult = gm.verifyHash('D9753B9F8634EB31730ACBA158892E174600CFE52099274DA6A173297FC1F2BB2AA5BACF34E43AD4273C05E9057A9B1E69B11C634CC2E179F8D0346115FF3529', msg, pub);
// console.log('vefiry and sign result: ', verifyResult);


// signature = gm.signHash(msg, m.privateKey);
// verifyResult = gm.verifyHash(signature, msg, m.publicKey);
// console.log('verifyHash and signHash result: ', verifyResult);

const assert = require("assert").strict;
let gm = require('.');
const PublicKey = require('./public_key');

// let keys = gm.generateKeyPairWithMnemonic();
// console.log(keys);

const mnemonic = 'scale exhibit casual wheat present dial sail embody tribe drop famous fiction';
const rawPrivate = '02271393bb64a826d289920da2ed2c371bcc51aecf92d5cff9f012dfb1132473';
const rawPublic = '04c4302fac496f6fd7b3a4856da892b089fa5a0cbf6f5688109dabe7bebd4efad3ed6002520cfe3284a60088b91fbdd2b2e81c663df602498fb8e58ca1488457b9';
let privateKey = '5HqEZtaJrTC936yiGr4Kgns3dStfLU1icemBUXqARbSx3yFsGJX';
let publicKey = 'GCF8Kdts4eSMh4n5F8QVpYeZP6kHpLoSQ6c37uSZxXWFcsdBWe96m';

let pub = PublicKey.fromString(publicKey);
console.log('uncompressed pub: ', pub.toUncompressed());
// let status = gm.isValidPublic(publicKey);
// assert.ok(status, 'public key is invalid');
// status = gm.isValidPrivate(privateKey);
// assert.ok(status, 'private key is invalid.');

// let keys2 = gm.generateKeyPairByMnemonic(keys.mnemonic);
// console.log(`gm.generateKeyPairByMnemonic : ${JSON.stringify(keys2)}`);

let hello = 'hello';
let sig = gm.sign(hello, privateKey);
console.log('sign: ', sig);

let status = gm.verify(sig, hello, publicKey);
console.log('verify: ', status);

sig = gm.signHash(hello, privateKey);
console.log('signHash: ', sig);

// let signature = gm.Signature.fromString(sig);
status = gm.verifyHash(sig, hello, publicKey);
console.log('verifyHash: ', status);
