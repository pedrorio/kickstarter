const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Node.js LTS runtime', function () {
  const pkg = require('../package.json');
  const root = path.join(__dirname, '..', '..');

  it('requires Node 24 or newer', function () {
    assert.equal(pkg.engines && pkg.engines.node, '>=24');
  });

  it('sets the OpenSSL legacy provider for Next.js 11 on Node 24', function () {
    ['build', 'start:dev', 'start:prod'].forEach((name) => {
      assert.ok(
        pkg.scripts[name].includes('NODE_OPTIONS=--openssl-legacy-provider'),
        name,
      );
    });
  });

  it('pins app Docker images to node:24', function () {
    ['Dockerfile', 'Dockerfile.dev', 'Dockerfile.test'].forEach((name) => {
      const source = fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
      assert.ok(source.startsWith('FROM node:24'), name);
      assert.equal(source.includes('node:latest'), false, name);
    });
  });

  it('passes CHAIN_ID into compose services', function () {
    ['docker-compose.yml', 'docker-compose.dev.yml', 'docker-compose.test.yml'].forEach((name) => {
      const source = fs.readFileSync(path.join(root, name), 'utf8');
      assert.ok(source.includes('CHAIN_ID'), name);
    });
  });
});
