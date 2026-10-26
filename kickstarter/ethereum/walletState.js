function errorCode(error) {
  if (!error) return undefined;
  if (error.code !== undefined) return error.code;
  if (error.error && error.error.code !== undefined) return error.error.code;
  return undefined;
}

function isUserRejection(error) {
  const code = errorCode(error);
  return code === 4001 || code === 'ACTION_REJECTED';
}

function isUnknownChainError(error) {
  return errorCode(error) === 4902;
}

function selectProvider(announced, ethereum) {
  const announcedProvider = (announced || []).find((entry) => (
    entry && entry.provider && typeof entry.provider.request === 'function'
  ));
  if (announcedProvider) {
    return {
      provider: announcedProvider.provider,
      source: 'eip-6963',
      name: (announcedProvider.info && announcedProvider.info.name) || 'wallet',
    };
  }
  if (ethereum && typeof ethereum.request === 'function') {
    return { provider: ethereum, source: 'window.ethereum', name: 'browser wallet' };
  }
  return { provider: null, source: 'none', name: '' };
}

function sessionFromAccounts({ accounts, walletChainId, expectedChainId }) {
  const account = accounts && accounts.length ? accounts[0] : null;
  if (!account) {
    return { status: 'disconnected', account: null, walletChainId: walletChainId ?? null };
  }
  if (Number(walletChainId) !== Number(expectedChainId)) {
    return { status: 'wrong-chain', account, walletChainId };
  }
  return { status: 'connected', account, walletChainId };
}

function reduceAccountsChanged(state, accounts) {
  return {
    ...state,
    ...sessionFromAccounts({
      accounts,
      walletChainId: state.walletChainId,
      expectedChainId: state.expectedChainId,
    }),
    errorMessage: '',
  };
}

function parseChainId(value) {
  if (typeof value === 'string' && value.startsWith('0x')) {
    return parseInt(value, 16);
  }
  return Number(value);
}

function reduceChainChanged(state, chainIdValue) {
  const walletChainId = parseChainId(chainIdValue);
  return {
    ...state,
    ...sessionFromAccounts({
      accounts: state.account ? [state.account] : [],
      walletChainId,
      expectedChainId: state.expectedChainId,
    }),
    errorMessage: '',
  };
}

function describeTransactionError(error) {
  if (isUserRejection(error)) {
    return 'The transaction was rejected in the wallet.';
  }
  if (!error) return 'The transaction failed.';
  return error.shortMessage || error.reason || error.message || 'The transaction failed.';
}

function shortAddress(address) {
  if (!address || address.length < 10) return address || '';
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

module.exports = {
  isUserRejection,
  isUnknownChainError,
  selectProvider,
  sessionFromAccounts,
  reduceAccountsChanged,
  reduceChainChanged,
  describeTransactionError,
  shortAddress,
  parseChainId,
};
