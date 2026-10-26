const { formatEther, parseEther } = require('ethers');

function weiToEther(value) {
  return formatEther(BigInt(value));
}

function etherToWei(value) {
  return parseEther(String(value)).toString();
}

function hasSpendingMajority(approvalCount, approversCount) {
  return BigInt(approvalCount) * 2n > BigInt(approversCount);
}

module.exports = {
  weiToEther,
  etherToWei,
  hasSpendingMajority,
};
