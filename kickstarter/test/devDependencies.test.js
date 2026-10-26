const assert = require('assert');

describe('development tooling', function () {
  const pkg = require('../package.json');
  const devOnly = ['eslint', 'fs-extra', 'ganache', 'mocha', 'solc', 'solhint'];
  const runtime = ['ethers', 'next', 'next-routes', 'react', 'react-dom', 'semantic-ui-react'];

  it('keeps contract and lint tools out of runtime dependencies', function () {
    devOnly.forEach((name) => {
      assert.equal(pkg.dependencies[name], undefined, name);
      assert.ok(pkg.devDependencies[name], name);
    });
  });

  it('keeps the Next.js runtime packages as dependencies', function () {
    runtime.forEach((name) => {
      assert.ok(pkg.dependencies[name], name);
      assert.equal(pkg.devDependencies[name], undefined, name);
    });
  });
});
