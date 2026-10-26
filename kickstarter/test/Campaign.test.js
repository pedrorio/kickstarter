const assert = require('assert');
const ganache = require('ganache');
const { ethers } = require('ethers');

async function balanceOf(provider, address) {
  // BrowserProvider can answer getBalance from a cached block. Ask the node.
  const hex = await provider.send('eth_getBalance', [address, 'latest']);
  return BigInt(hex);
}
const {
  abiOf,
  bytecodeOf,
  factoryArtifact,
  campaignArtifact,
} = require('../ethereum/artifacts');

describe('Campaigns', function () {
  let ganacheProvider;
  let provider;
  let accounts;
  let factory;
  let campaign;

  before(async function () {
    ganacheProvider = ganache.provider({
      logging: { quiet: true },
      wallet: { totalAccounts: 10, defaultBalance: 1000 },
      chain: { chainId: 1337 },
      miner: { blockGasLimit: 30_000_000 },
    });
    provider = new ethers.BrowserProvider(ganacheProvider);
    accounts = await provider.send('eth_accounts', []);
  });

  after(async function () {
    if (ganacheProvider && typeof ganacheProvider.disconnect === 'function') {
      await ganacheProvider.disconnect();
    }
  });

  beforeEach(async function () {
    const deployer = await provider.getSigner(0);
    const Factory = new ethers.ContractFactory(
      abiOf(factoryArtifact),
      bytecodeOf(factoryArtifact),
      deployer
    );
    factory = await Factory.deploy();
    await factory.waitForDeployment();

    const created = await factory.createCampaign(100);
    await created.wait();
    const [campaignAddress] = await factory.getDeployedCampaigns();
    campaign = new ethers.Contract(campaignAddress, abiOf(campaignArtifact), deployer);
  });

  it('deploys a factory and a campaign', async function () {
    assert.ok(await factory.getAddress());
    assert.ok(await campaign.getAddress());
  });

  it('marks caller as the campaign manager', async function () {
    const manager = await campaign.manager();
    assert.equal(manager, ethers.getAddress(accounts[0]));
  });

  it('allows people to contribute money and marks them as approvers', async function () {
    const contributor = campaign.connect(await provider.getSigner(1));
    const tx = await contributor.contribute({ value: 200 });
    await tx.wait();
    const isContributor = await campaign.approvers(accounts[1]);
    assert.equal(isContributor, true);
  });

  it('requires a minimum contribution', async function () {
    await assert.rejects(campaign.contribute({ value: 5 }));
    await assert.rejects(campaign.contribute({ value: 100 }));
  });

  it('allows a manager to make a payment request', async function () {
    const tx = await campaign.createRequest('Buy batteries', 100, accounts[1]);
    await tx.wait();
    const request = await campaign.requests(0);
    assert.equal(request.description, 'Buy batteries');
    assert.equal(request.value, 100n);
    assert.equal(request.complete, false);
  });

  it('rejects a spend request from a non-manager', async function () {
    const other = campaign.connect(await provider.getSigner(1));
    await assert.rejects(other.createRequest('Nope', 100, accounts[2]));
  });

  it('processes the request', async function () {
    const manager = await provider.getSigner(0);
    const recipientBefore = await balanceOf(provider, accounts[1]);

    const contribution = await campaign.contribute({ value: ethers.parseEther('10') });
    await contribution.wait();

    const created = await campaign.createRequest(
      'Another request',
      ethers.parseEther('5'),
      accounts[1]
    );
    await created.wait();

    const approved = await campaign.approveRequest(0);
    await approved.wait();

    const finalized = await campaign.connect(manager).finalizeRequest(0);
    await finalized.wait();

    const recipientAfter = await balanceOf(provider, accounts[1]);
    assert.equal(recipientAfter - recipientBefore, ethers.parseEther('5'));

    const request = await campaign.requests(0);
    assert.equal(request.complete, true);
  });
});
