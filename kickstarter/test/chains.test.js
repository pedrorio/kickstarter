const assert = require('assert');
const { resolveChainId, SEPOLIA_CHAIN_ID, chainIdToHex } = require('../ethereum/chains');

describe('chain configuration', function () {
  it('defaults an empty chain id to Sepolia', function () {
    assert.equal(resolveChainId(undefined).chainId, SEPOLIA_CHAIN_ID);
    assert.equal(resolveChainId('').chainId, SEPOLIA_CHAIN_ID);
    assert.equal(resolveChainId('').replacedDeprecated, false);
  });

  it('replaces deprecated testnets with Sepolia', function () {
    const rinkeby = resolveChainId('4');
    assert.equal(rinkeby.chainId, SEPOLIA_CHAIN_ID);
    assert.equal(rinkeby.replacedDeprecated, true);
    assert.match(rinkeby.warning, /Rinkeby/);

    assert.equal(resolveChainId(3).chainId, SEPOLIA_CHAIN_ID);
    assert.equal(resolveChainId('5').chainId, SEPOLIA_CHAIN_ID);
    assert.equal(resolveChainId(42).chainId, SEPOLIA_CHAIN_ID);
  });

  it('keeps a local chain id', function () {
    const local = resolveChainId('1337');
    assert.equal(local.chainId, 1337);
    assert.equal(local.chainName, 'Localhost');
    assert.equal(local.warning, '');
  });

  it('replaces an invalid chain id with Sepolia', function () {
    const invalid = resolveChainId('nope');
    assert.equal(invalid.chainId, SEPOLIA_CHAIN_ID);
    assert.match(invalid.warning, /invalid/i);
  });

  it('formats chain ids as hex', function () {
    assert.equal(chainIdToHex(11155111), '0xaa36a7');
    assert.equal(chainIdToHex(1), '0x1');
  });
});
