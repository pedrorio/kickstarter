const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('continuous integration', function () {
  const source = fs.readFileSync(
    path.join(__dirname, '../../.github/workflows/ci.yml'),
    'utf8',
  );

  it('installs, tests, and builds on Node 24', function () {
    assert.ok(source.includes('node-version: 24'));
    assert.ok(source.includes('yarn install --frozen-lockfile'));
    assert.ok(source.includes('yarn test'));
    assert.ok(source.includes('yarn build'));
    assert.ok(source.includes('yarn install --frozen-lockfile --production'));
  });

  it('does not invent a lint or typecheck step', function () {
    assert.equal(/yarn lint/.test(source), false);
    assert.equal(/tsc/.test(source), false);
  });
});
