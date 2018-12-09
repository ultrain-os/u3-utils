var waitUntil = require("./wait-until");
var wait = require("./wait");
var isPromise = require("./is-promise");
var promisify = require("./promisify");
var assertThrows = require("./assert-throws");

var test = {
  waitUntil: waitUntil,
  wait: wait,
  assertThrows: assertThrows,
  isPromise: isPromise,
  promisify: promisify
};
module.exports = test;