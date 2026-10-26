const { ethers } = require('ethers');
const { abiOf, factoryArtifact } = require('./artifacts');
const { readPublicConfig } = require('./runtimeConfig');
const { getReadProvider } = require('./readProvider');

function factoryAddress() {
  const { factoryAddress: address } = readPublicConfig();
  if (!address) {
    throw new Error('FACTORY_ADDRESS is not set.');
  }
  return ethers.getAddress(address);
}

function factoryContract(runner) {
  return new ethers.Contract(factoryAddress(), abiOf(factoryArtifact), runner);
}

async function getDeployedCampaigns() {
  const campaigns = await factoryContract(getReadProvider()).getDeployedCampaigns();
  return campaigns.map((address) => ethers.getAddress(address));
}

async function createCampaign(minimumContributionWei, signer) {
  const tx = await factoryContract(signer).createCampaign(minimumContributionWei);
  await tx.wait();
}

module.exports = {
  getDeployedCampaigns,
  createCampaign,
};
