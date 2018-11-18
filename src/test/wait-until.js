const wait = require("./wait");
const promisify = require("./promisify");

/**
 * waits until the given function returns true
 * @param  {function}  fun
 * @return {Promise}
 */
function waitUntil(fun, timeout, interval) {
  timeout = timeout || 0;
  interval = interval || 20;
  let timedOut = false;
  let ok = false;

  if (timeout !== 0)
    wait(timeout).then(function() {
      timedOut = true;
    });

  return new Promise(function(resolve, reject) {
    var runLoop = function() {
      if (ok) {
        resolve();
        return;
      }
      if (timedOut) {
        reject(new Error("U3Utils.waitUntil(): reached timeout of " + timeout + "ms"));
        return;
      }
      wait(interval).then(function() {
        const value = promisify(fun());
        value.then(function(val) {
          ok = val;
          runLoop();
        });
      });
    };
    runLoop();
  });
}

module.exports = waitUntil;