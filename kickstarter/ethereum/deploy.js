const { ethers } = require('ethers');
const { abiOf, bytecodeOf, factoryArtifact } = require('./artifacts');

function safeMessage(error, mnemonic) {
  const message = (error && (error.shortMessage || error.message)) || 'Deploy failed.';
  if (mnemonic && message.includes(mnemonic)) {
    return message.split(mnemonic).join('[redacted]');
  }
  return message;
}

async function main() {
  const mnemonic = process.env.ACCOUNT_MNEMONIC;
  const endpoint = process.env.NETWORK_ENDPOINT;
  if (!mnemonic || !endpoint) {
    console.error('Refusing to deploy: set ACCOUNT_MNEMONIC and NETWORK_ENDPOINT. The mnemonic is never printed.');
    process.exit(1);
  }

  const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic).connect(new ethers.JsonRpcProvider(endpoint));
  console.log('Attempting to deploy from account:', wallet.address);

  const factory = new ethers.ContractFactory(
    abiOf(factoryArtifact),
    bytecodeOf(factoryArtifact),
    wallet
  );
  const deployed = await factory.deploy();
  await deployed.waitForDeployment();
  console.log('Contract deployed to address:', await deployed.getAddress());
}

main().catch((error) => {
  console.error(safeMessage(error, process.env.ACCOUNT_MNEMONIC));
  process.exit(1);
});
