const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('ethereum client dependencies', function () {
  const pkg = require('../package.json');

  it('does not depend on web3.js beta or the truffle HD wallet provider', function () {
    assert.equal(pkg.dependencies.web3, undefined);
    assert.equal(pkg.devDependencies && pkg.devDependencies.web3, undefined);
    assert.equal(pkg.dependencies['truffle-hdwallet-provider'], undefined);
    assert.ok(pkg.dependencies.ethers);
  });

  it('does not pass the deploy mnemonic through webpack', function () {
    const source = fs.readFileSync(path.join(__dirname, '../next.config.js'), 'utf8');
    assert.equal(source.includes('ACCOUNT_MNEMONIC'), false);
    assert.equal(source.includes('EnvironmentPlugin'), false);
  });
});
