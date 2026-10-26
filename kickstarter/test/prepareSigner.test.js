const assert = require('assert');
const { prepareSigner } = require('../ethereum/prepareSigner');
const { collectAnnouncedProviders } = require('../ethereum/eip6963');

function wallet(session, connectResult) {
  const calls = { connect: 0, getSigner: 0 };
  return {
    calls,
    getSession() {
      return session;
    },
    async connect() {
      calls.connect += 1;
      return connectResult || session;
    },
    async getSigner() {
      calls.getSigner += 1;
      return { address: (connectResult || session).account };
    },
  };
}

describe('prepareSigner', function () {
  it('does not prompt when no wallet is installed', async function () {
    const current = wallet({ status: 'no-wallet', expectedChainName: 'Sepolia' });
    await assert.rejects(
      prepareSigner(current),
      /No Ethereum wallet is installed/
    );
    assert.equal(current.calls.connect, 0);
    assert.equal(current.calls.getSigner, 0);
  });

  it('connects on a user action when the wallet is disconnected', async function () {
    const current = wallet(
      { status: 'disconnected', expectedChainName: 'Sepolia' },
      { status: 'connected', account: '0xabc', expectedChainName: 'Sepolia' }
    );
    const signer = await prepareSigner(current);
    assert.equal(current.calls.connect, 1);
    assert.equal(signer.address, '0xabc');
  });

  it('surfaces a rejected connection', async function () {
    const current = wallet(
      { status: 'disconnected', expectedChainName: 'Sepolia' },
      { status: 'rejected', errorMessage: 'The wallet connection was rejected.', expectedChainName: 'Sepolia' }
    );
    await assert.rejects(prepareSigner(current), /rejected/);
    assert.equal(current.calls.getSigner, 0);
  });

  it('refuses to sign on the wrong chain', async function () {
    const current = wallet({
      status: 'wrong-chain',
      expectedChainName: 'Sepolia',
    });
    await assert.rejects(prepareSigner(current), /Switch to Sepolia/);
    assert.equal(current.calls.connect, 0);
  });

  it('signs without prompting again when already connected', async function () {
    const current = wallet({
      status: 'connected',
      account: '0xabc',
      expectedChainName: 'Sepolia',
    });
    await prepareSigner(current);
    assert.equal(current.calls.connect, 0);
    assert.equal(current.calls.getSigner, 1);
  });
});

describe('EIP-6963 discovery', function () {
  it('collects a provider that announces itself', async function () {
    const target = new EventTarget();
    const provider = { request() {} };
    target.addEventListener('eip6963:requestProvider', () => {
      target.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
        detail: { info: { uuid: 'demo', name: 'Demo Wallet' }, provider },
      }));
    });
    const found = await collectAnnouncedProviders(target, 20);
    assert.equal(found.length, 1);
    assert.equal(found[0].provider, provider);
    assert.equal(found[0].info.name, 'Demo Wallet');
  });
});
