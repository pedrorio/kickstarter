const factoryArtifact = require('./build/CampaignFactory.json');
const campaignArtifact = require('./build/Campaign.json');

function abiOf(artifact) {
  return JSON.parse(artifact.interface);
}

function bytecodeOf(artifact) {
  if (!artifact.bytecode) {
    throw new Error('Compiled bytecode is missing. Run yarn sol:compile before deploying.');
  }
  return artifact.bytecode.startsWith('0x') ? artifact.bytecode : `0x${artifact.bytecode}`;
}

module.exports = {
  factoryArtifact,
  campaignArtifact,
  abiOf,
  bytecodeOf,
};
