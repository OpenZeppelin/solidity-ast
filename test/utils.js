const fs = require('promisified/fs');
const path = require('path');
const assert = require('assert');

const { latest } = require('./helpers/solc-versions');
const { compile } = require('./helpers/solc-compile');

const { findAll, astDereferencer } = require('../utils');

describe('findAll', function () {
  const source = path.join(__dirname, 'sources/find-all.sol');
  const counts = {
    SourceUnit: 1,
    StructDefinition: 2,
    FunctionDefinition: 1,
    YulVariableDeclaration: 1,
  };

  before('reading and compiling source file', async function () {
    this.timeout(10 * 60 * 1000);
    const content = await fs.readFile(source, 'utf8');
    const output = await compile(latest, { 0: { content } });
    this.ast = output.sources[0].ast;
  });

  it('basic', function () {
    for (const nodeType in counts) {
      const nodes = [...findAll(nodeType, this.ast)];
      assert.strictEqual(nodes.length, counts[nodeType]);
    }
  });

  it('curried', function () {
    const nodeType = 'StructDefinition';
    const nodes = [...findAll(nodeType)(this.ast)];
    assert.strictEqual(nodes.length, counts[nodeType]);
  });

  it('multiple', function () {
    const nodeTypes = Object.keys(counts);
    const count = Object.values(counts).reduce((a, b) => a + b);
    const nodes = [...findAll(nodeTypes, this.ast)];
    assert.strictEqual(nodes.length, count);
  });
});

describe('ast dereferencer', function () {
  const source = path.join(__dirname, 'sources/ast-deref.sol');

  before('reading and compiling source file', async function () {
    this.timeout(10 * 60 * 1000);
    const content = await fs.readFile(source, 'utf8');
    this.output = await compile(latest, { 0: { content } });
    this.ast = this.output.sources[0].ast;
  });

  it('finds contracts', function () {
    const deref = astDereferencer(this.output);
    for (const c of findAll('ContractDefinition', this.ast)) {
      assert.strictEqual(c, deref('ContractDefinition', c.id));
    }
  });

  it('finds functions', function () {
    const deref = astDereferencer(this.output);
    for (const c of findAll('FunctionDefinition', this.ast)) {
      assert.strictEqual(c, deref('FunctionDefinition', c.id));
    }
  });

  it('cache works', function () {
    const deref = astDereferencer(this.output);
    const [c1] = findAll('ContractDefinition', this.ast);
    assert.strictEqual(c1, deref('ContractDefinition', c1.id));
    assert.strictEqual(c1, deref('ContractDefinition', c1.id));
  });

  it('errors on wrong type', function () {
    const deref = astDereferencer(this.output);
    const [c1] = findAll('ContractDefinition', this.ast);
    assert.throws(
      () => deref('FunctionDefinition', c1.id),
      { message: /^No node with id \d+ of type FunctionDefinition$/ },
    );
  });

  it('errors on unknown id', function () {
    const deref = astDereferencer(this.output);
    assert.throws(
      () => deref('FunctionDefinition', 1e10),
      { message: /^No node with id \d+ of type FunctionDefinition$/ },
    );
  });

  it('multiple node types', function () {
    const deref = astDereferencer(this.output);
    const [c1] = findAll('ContractDefinition', this.ast);
    const [f1] = findAll('FunctionDefinition', this.ast);
    assert.strictEqual(c1, deref(['ContractDefinition', 'FunctionDefinition'], c1.id));
    assert.strictEqual(f1, deref(['ContractDefinition', 'FunctionDefinition'], f1.id));
  });

  it('curried', function () {
    const deref = astDereferencer(this.output);
    const c3 = [...findAll('ContractDefinition', this.ast)].find(c => c.name === 'C3');
    const baseContracts = c3.linearizedBaseContracts.map(deref('ContractDefinition'));
    assert.deepEqual(baseContracts.map(c => c.name), ['C3', 'C2', 'C1']);
  });
});
