const assert = require('assert');
const {
  selectProvider,
  sessionFromAccounts,
  reduceAccountsChanged,
  reduceChainChanged,
  describeTransactionError,
  isUserRejection,
} = require('../ethereum/walletState');

describe('wallet state', function () {
  const expectedChainId = 11155111;

  it('prefers an EIP-6963 provider over window.ethereum', function () {
    const announcedProvider = { request() {} };
    const injected = { request() {} };
    const selected = selectProvider(
      [{ info: { name: 'Demo Wallet' }, provider: announcedProvider }],
      injected
    );
    assert.equal(selected.provider, announcedProvider);
    assert.equal(selected.source, 'eip-6963');
    assert.equal(selected.name, 'Demo Wallet');
  });

  it('uses window.ethereum when nothing announces', function () {
    const injected = { request() {} };
    const selected = selectProvider([], injected);
    assert.equal(selected.provider, injected);
    assert.equal(selected.source, 'window.ethereum');
  });

  it('reports no provider when the browser has no EIP-1193 wallet', function () {
    const selected = selectProvider([], { currentProvider: {} });
    assert.equal(selected.provider, null);
    assert.equal(selected.source, 'none');
  });

  it('ignores a legacy provider that cannot request', function () {
    const selected = selectProvider(
      [{ info: { name: 'Old' }, provider: { sendAsync() {} } }],
      undefined
    );
    assert.equal(selected.provider, null);
  });

  it('marks a matching chain as connected', function () {
    const session = sessionFromAccounts({
      accounts: ['0xabc'],
      walletChainId: expectedChainId,
      expectedChainId,
    });
    assert.equal(session.status, 'connected');
    assert.equal(session.account, '0xabc');
  });

  it('marks a different chain as wrong-chain', function () {
    const session = sessionFromAccounts({
      accounts: ['0xabc'],
      walletChainId: 1,
      expectedChainId,
    });
    assert.equal(session.status, 'wrong-chain');
  });

  it('clears the account when the wallet reports none', function () {
    const next = reduceAccountsChanged({
      account: '0xabc',
      walletChainId: expectedChainId,
      expectedChainId,
      status: 'connected',
    }, []);
    assert.equal(next.status, 'disconnected');
    assert.equal(next.account, null);
  });

  it('updates the account and chain from wallet events', function () {
    const changedAccount = reduceAccountsChanged({
      account: '0xabc',
      walletChainId: expectedChainId,
      expectedChainId,
      status: 'connected',
    }, ['0xdef']);
    assert.equal(changedAccount.account, '0xdef');
    assert.equal(changedAccount.status, 'connected');

    const changedChain = reduceChainChanged(changedAccount, '0x1');
    assert.equal(changedChain.walletChainId, 1);
    assert.equal(changedChain.status, 'wrong-chain');
    assert.equal(changedChain.account, '0xdef');
  });

  it('describes a rejected signature without a raw rpc dump', function () {
    assert.equal(isUserRejection({ code: 4001 }), true);
    assert.equal(
      describeTransactionError({ code: 'ACTION_REJECTED', message: 'user denied' }),
      'The transaction was rejected in the wallet.'
    );
  });
});
