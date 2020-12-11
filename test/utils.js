const fs = require('promisified/fs');
const path = require('path');
const assert = require('assert');

const { latest } = require('./utils/solc-versions');
const { compile } = require('./utils/solc-compile');

const { findAll } = require('../utils');

const source = path.join(__dirname, 'sources/find-all.sol');
const counts = {
  SourceUnit: 1,
  StructDefinition: 2,
};

describe('findAll', function () {
  before('reading and compiling source file', async function () {
    const content = await fs.readFile(source, 'utf8');
    const output = await compile(latest, { 0: { content } });
    this.ast = output.sources[0].ast;
  });

  it('basic', async function () {
    for (const nodeType in counts) {
      const nodes = [...findAll(nodeType, this.ast)];
      assert.strictEqual(nodes.length, counts[nodeType]);
    }
  });

  it('curried', async function () {
    const nodeType = 'StructDefinition';
    const nodes = [...findAll(nodeType)(this.ast)];
    assert.strictEqual(nodes.length, counts[nodeType]);
  });
});
