const SEPOLIA_CHAIN_ID = 11155111;

const DEPRECATED_CHAINS = {
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  42: 'Kovan',
};

const CHAIN_NAMES = {
  1: 'Ethereum',
  11155111: 'Sepolia',
  1337: 'Localhost',
  31337: 'Localhost',
};

function chainNameFor(chainId) {
  return CHAIN_NAMES[Number(chainId)] || `chain ${chainId}`;
}

function chainIdToHex(chainId) {
  return `0x${Number(chainId).toString(16)}`;
}

function resolveChainId(raw) {
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return {
      chainId: SEPOLIA_CHAIN_ID,
      chainName: 'Sepolia',
      warning: '',
      replacedDeprecated: false,
    };
  }

  const chainId = Number(String(raw).trim());
  if (!Number.isInteger(chainId) || chainId <= 0) {
    return {
      chainId: SEPOLIA_CHAIN_ID,
      chainName: 'Sepolia',
      warning: 'CHAIN_ID is invalid. Using Sepolia (11155111).',
      replacedDeprecated: false,
    };
  }

  if (DEPRECATED_CHAINS[chainId]) {
    return {
      chainId: SEPOLIA_CHAIN_ID,
      chainName: 'Sepolia',
      warning: `${DEPRECATED_CHAINS[chainId]} (${chainId}) is a deprecated testnet. Using Sepolia (11155111).`,
      replacedDeprecated: true,
    };
  }

  return {
    chainId,
    chainName: chainNameFor(chainId),
    warning: '',
    replacedDeprecated: false,
  };
}

function addChainParams(chainId, rpcUrl) {
  const params = {
    chainId: chainIdToHex(chainId),
    chainName: chainNameFor(chainId),
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: rpcUrl ? [rpcUrl] : [],
  };
  if (Number(chainId) === SEPOLIA_CHAIN_ID) {
    params.blockExplorerUrls = ['https://sepolia.etherscan.io'];
  }
  return params;
}

module.exports = {
  SEPOLIA_CHAIN_ID,
  DEPRECATED_CHAINS,
  resolveChainId,
  chainNameFor,
  chainIdToHex,
  addChainParams,
};
