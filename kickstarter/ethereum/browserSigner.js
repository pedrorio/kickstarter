const { ethers } = require('ethers');
const { isUserRejection } = require('./walletState');

async function getSubmitSigner() {
  if (typeof window === 'undefined') {
    throw new Error('Transactions can only be signed in the browser.');
  }
  const ethereum = window.ethereum;
  if (!ethereum || typeof ethereum.request !== 'function') {
    throw new Error('No EIP-1193 wallet was found. This app does not use window.web3.');
  }
  let accounts;
  try {
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    if (isUserRejection(error)) {
      throw new Error('The wallet connection was rejected.');
    }
    throw error;
  }
  if (!accounts || accounts.length === 0) {
    throw new Error('The wallet did not return an account.');
  }
  const provider = new ethers.BrowserProvider(ethereum);
  return provider.getSigner();
}

module.exports = { getSubmitSigner };
