/**
 * returns true if promise is given
 */
function isPromise(value) {
  try {
    if (typeof value.then === "function")
      return true;
  } catch (err) {
  }
  return false;
}

module.exports = isPromise;