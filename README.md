# u3-utils
sets of utilities for ultrain

* ecc
* test

## Installation

  ```sh
$ npm install u3-utils
```

  ```javascript
var U3Utils = require('u3-utils');
```

## wait()

Waits until the given time has expired and then resolves.

  ```javascript
it('should wait', async() => {
    await U3Utils.wait(200);
    console.log('200 ms is over');
});
```

## waitUntil()

Waits until the given predicate-function returns true. Throws if the optional timeout has passed before.

  ```javascript
it('should wait until server is online', async() => {
    const checkServer = async() => {
        try{
            await fetch('http://example.com/api/');
            return true;
        }catch(){
            return false;
        }
    };
    await U3Utils.waitUntil(checkServer);
});
```

With timeout:

  ```javascript
it('should wait until server is online (maxtime: 1000ms)', async() => {
    const checkServer = async() => {
        try{
            await fetch('http://example.com/api/');
            return true;
        }catch(){
            return false;
        }
    };
    await U3Utils.waitUntil(checkServer, 1000);
});
```

## assertThrows()

Async-Form of [assert.throws](https://nodejs.org/api/assert.html#assert_assert_throws_block_error_message). Asserts that the given function throws with the defined error, throws if not.

```javascript
// with error-type
it('should throw because route does not exist', async() => {
    const getServerVersion = async() => {
        const response = await fetch('http://example.com/foobar/');
        return response;
    };
    await U3Utils.assertThrows(
        () => getServerVersion(),       // function that throws (required)
        Error                   // Error-type           (optional)
    );
});

// with error-text-flag
it('should throw because route does not exist', async() => {
    const pingServer = async() => {
        try{
            await fetch('http://example.com/foobar/');            
        }catch(err){
            throw new Error('route not reachable');
        }
    };
    await U3Utils.assertThrows(
        () => pingServer(),       // function that throws                                    (required)
        Error,                    // Error-type                                              (optional)
        'reachable'               // text-flag, throw if error-message does not include this (optional)  
    );
});

// assertThrows returns the error
it('should have the custom error-property', async() => {
    const throwingFunction = async()=>{
        const error = new Error('error message');
        error.foo = 'bar';
        throw error;
    }
    const thrown = await U3Utils.assertThrows(
        () => pingServer(),       // function that throws                                    (required)
        Error,                    // Error-type                                              (optional)
        'message'               // text-flag, throw if error-message does not include this (optional)  
    );
    assert.equal(thrown.foo, 'bar');
});
```

## isPromise()
Returns true if the given value is a `Promise`;

```javascript

const is = U3Utils.isPromise(myAsyncFunction()); // true
const is = U3Utils.isPromise('foobar'); // false

```

## promisify

Transforms the given value to a promise if it was no promise before.

  ``` javascript

const ensurePromise = U3Utils.isPromise(maybeAsyncFunction());

// now you are sure this is a promise
ensurePromise.then(/* ... */)

```
