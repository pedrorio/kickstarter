async function prepareSigner(wallet) {
  if (!wallet || typeof wallet.getSession !== 'function' || typeof wallet.connect !== 'function') {
    throw new Error('Wallet status is unavailable.');
  }

  let session = wallet.getSession();
  if (session.status === 'no-wallet') {
    throw new Error('No Ethereum wallet is installed in this browser.');
  }

  if (session.status !== 'connected' && session.status !== 'wrong-chain') {
    session = await wallet.connect();
  }

  if (session.status === 'wrong-chain') {
    throw new Error(`This wallet is on the wrong network. Switch to ${session.expectedChainName} and try again.`);
  }

  if (session.status !== 'connected') {
    throw new Error(session.errorMessage || 'Connect a wallet before sending a transaction.');
  }

  return wallet.getSigner();
}

module.exports = { prepareSigner };
