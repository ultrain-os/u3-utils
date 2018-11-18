const waitUntil = require("./wait-until");
const wait = require("./wait");
const isPromise = require("./is-promise");
const promisify = require("./promisify");
const assertThrows = require("./assert-throws");

const test = {
  waitUntil,
  wait,
  assertThrows,
  isPromise,
  promisify
};
module.exports = test;
