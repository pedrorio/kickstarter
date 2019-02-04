const webpack = require('webpack');

module.exports = {
  publicRuntimeConfig: {
    NETWORK_ENDPOINT: process.env.NETWORK_ENDPOINT,
    FACTORY_ADDRESS: process.env.FACTORY_ADDRESS
  },
  webpack: (config) => {
    config.plugins.push(
      new webpack.EnvironmentPlugin({
        ACCOUNT_MNEMONIC: process.env.ACCOUNT_MNEMONIC,
        NETWORK_ENDPOINT: process.env.NETWORK_ENDPOINT,
        FACTORY_ADDRESS: process.env.FACTORY_ADDRESS
      })
    );
    return config;
  }
};
