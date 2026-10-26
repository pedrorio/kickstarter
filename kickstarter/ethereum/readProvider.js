const { ethers } = require('ethers');
const { readPublicConfig } = require('./runtimeConfig');

function getReadProvider() {
  const { networkEndpoint, chainId } = readPublicConfig();
  if (!networkEndpoint) {
    throw new Error('NETWORK_ENDPOINT is not set. Add a read-only RPC URL.');
  }
  return new ethers.JsonRpcProvider(networkEndpoint, chainId, { staticNetwork: true });
}

module.exports = { getReadProvider };
