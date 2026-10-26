const assert = require('assert');
const { readableRpcError } = require('../ethereum/readErrors');

describe('read errors', function () {
  it('replaces a refused connection with a readable message', function () {
    const message = readableRpcError(new Error('connect ECONNREFUSED 127.0.0.1:8545'));
    assert.match(message, /read-only network/);
    assert.doesNotMatch(message, /ECONNREFUSED/);
  });

  it('keeps a missing configuration message', function () {
    assert.equal(
      readableRpcError(new Error('FACTORY_ADDRESS is not set.')),
      'FACTORY_ADDRESS is not set.'
    );
  });
});
