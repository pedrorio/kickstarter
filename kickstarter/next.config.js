const { resolveChainId } = require('./ethereum/chains');

const resolved = resolveChainId(process.env.CHAIN_ID);

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  publicRuntimeConfig: {
    NETWORK_ENDPOINT: process.env.NETWORK_ENDPOINT || '',
    FACTORY_ADDRESS: process.env.FACTORY_ADDRESS || '',
    CHAIN_ID: String(resolved.chainId),
    CHAIN_NAME: resolved.chainName,
    CHAIN_WARNING: resolved.warning,
  },
};
