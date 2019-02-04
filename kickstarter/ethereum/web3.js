import Web3 from 'web3';

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { NETWORK_ENDPOINT } = publicRuntimeConfig;

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // browser + metamask
  web3 = new Web3(window.web3.currentProvider);
  
} else {
  // server or not metamask
  
  const provider = new Web3.providers.HttpProvider(
    NETWORK_ENDPOINT
  );
  
  web3 = new Web3(provider);
  
}

export default web3;
