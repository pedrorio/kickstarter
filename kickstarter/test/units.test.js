const assert = require('assert');
const { weiToEther, etherToWei, hasSpendingMajority } = require('../ethereum/units');

describe('unit helpers', function () {
  it('converts between ether and wei', function () {
    assert.equal(etherToWei('1.5'), '1500000000000000000');
    assert.equal(weiToEther('1500000000000000000'), '1.5');
  });

  it('matches the contract majority check', function () {
    assert.equal(hasSpendingMajority(1, 1), true);
    assert.equal(hasSpendingMajority(1, 2), false);
    assert.equal(hasSpendingMajority(2, 3), true);
    assert.equal(hasSpendingMajority(2, 4), false);
  });
});
