const { ethers } = require('ethers');
const { abiOf, campaignArtifact } = require('./artifacts');
const { getReadProvider } = require('./readProvider');

function campaignAt(address, runner) {
  return new ethers.Contract(ethers.getAddress(address), abiOf(campaignArtifact), runner);
}

async function getCampaignSummary(address) {
  const summary = await campaignAt(address, getReadProvider()).getSummary();
  return {
    minimumContribution: summary[0].toString(),
    balance: summary[1].toString(),
    requestsCount: summary[2].toString(),
    approversCount: summary[3].toString(),
    manager: ethers.getAddress(summary[4]),
  };
}

async function getCampaignRequests(address) {
  const campaign = campaignAt(address, getReadProvider());
  const requestCount = await campaign.getRequestsCount();
  const approversCount = await campaign.approversCount();
  const count = Number(requestCount);
  const requests = await Promise.all(
    Array.from({ length: count }, (_, index) => campaign.requests(index))
  );
  return {
    requestCount: requestCount.toString(),
    approversCount: approversCount.toString(),
    requests: requests.map((request) => ({
      description: request.description,
      value: request.value.toString(),
      recipient: ethers.getAddress(request.recipient),
      complete: Boolean(request.complete),
      approvalCount: request.approvalCount.toString(),
    })),
  };
}

async function contribute(address, etherAmount, signer) {
  const tx = await campaignAt(address, signer).contribute({
    value: ethers.parseEther(String(etherAmount)),
  });
  await tx.wait();
}

async function createRequest(address, description, etherAmount, recipient, signer) {
  const tx = await campaignAt(address, signer).createRequest(
    description,
    ethers.parseEther(String(etherAmount)),
    ethers.getAddress(recipient)
  );
  await tx.wait();
}

async function approveRequest(address, index, signer) {
  const tx = await campaignAt(address, signer).approveRequest(index);
  await tx.wait();
}

async function finalizeRequest(address, index, signer) {
  const tx = await campaignAt(address, signer).finalizeRequest(index);
  await tx.wait();
}

module.exports = {
  getCampaignSummary,
  getCampaignRequests,
  contribute,
  createRequest,
  approveRequest,
  finalizeRequest,
};
