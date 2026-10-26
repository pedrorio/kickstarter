const getNextConfig = require('next/config');
const { resolveChainId } = require('./chains');

let cached = null;

function configFromValues(values) {
  const resolved = resolveChainId(values.CHAIN_ID);
  return {
    networkEndpoint: values.NETWORK_ENDPOINT || '',
    factoryAddress: values.FACTORY_ADDRESS || '',
    chainId: resolved.chainId,
    chainName: resolved.chainName,
    chainWarning: values.CHAIN_WARNING || resolved.warning || '',
  };
}

function readProcessEnv() {
  return configFromValues({
    NETWORK_ENDPOINT: process.env.NETWORK_ENDPOINT,
    FACTORY_ADDRESS: process.env.FACTORY_ADDRESS,
    CHAIN_ID: process.env.CHAIN_ID,
  });
}

function readNextRuntimeConfig() {
  const getConfig = getNextConfig.default || getNextConfig;
  if (typeof getConfig !== 'function') return null;
  const loaded = getConfig();
  if (!loaded || !loaded.publicRuntimeConfig) return null;
  return configFromValues(loaded.publicRuntimeConfig);
}

function setRuntimeConfig(config) {
  cached = config;
}

function readPublicConfig() {
  if (cached) return cached;
  if (typeof window === 'undefined') return readProcessEnv();
  try {
    const fromNext = readNextRuntimeConfig();
    if (fromNext) return fromNext;
  } catch (error) {
    // Fall through to process.env, which is empty in the browser bundle.
  }
  return readProcessEnv();
}

module.exports = {
  setRuntimeConfig,
  readPublicConfig,
  configFromValues,
  readProcessEnv,
};
