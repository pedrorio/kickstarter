const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('repository docs', function () {
  const readme = fs.readFileSync(path.join(__dirname, '../../README.md'), 'utf8');
  const example = fs.readFileSync(path.join(__dirname, '../../.env.example'), 'utf8');

  it('covers the architecture, local chain, env names, and OpenSpec', function () {
    assert.ok(readme.includes('CampaignFactory'));
    assert.ok(readme.includes('finalizeRequest'));
    assert.ok(readme.includes('yarn ganache'));
    assert.ok(readme.includes('NETWORK_ENDPOINT'));
    assert.ok(readme.includes('FACTORY_ADDRESS'));
    assert.ok(readme.includes('CHAIN_ID'));
    assert.ok(readme.includes('ACCOUNT_MNEMONIC'));
    assert.ok(readme.includes('openspec/specs/'));
  });

  it('does not include a mnemonic or a filled-in secret', function () {
    assert.equal(/ACCOUNT_MNEMONIC\s*=\s*\S+/.test(readme), false);
    assert.equal(example.includes('ACCOUNT_MNEMONIC'), false);
    ['NETWORK_ENDPOINT', 'FACTORY_ADDRESS', 'CHAIN_ID'].forEach((name) => {
      const line = example.split('\n').find((entry) => entry.startsWith(`${name}=`));
      assert.equal(line, `${name}=`);
    });
  });
});
