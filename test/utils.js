const fs = require('promisified/fs');
const path = require('path');
const assert = require('assert');

const { latest } = require('./helpers/solc-versions');
const { compile } = require('./helpers/solc-compile');

const { isNodeType, findAll, astDereferencer, srcDecoder, NodeInfoResolver } = require('../utils');

describe('isNodeType', function () {
  it('single', function () {
    assert(isNodeType('SourceUnit', { nodeType: 'SourceUnit' }));
    assert(!isNodeType('SourceUnit', { nodeType: 'ContractDefinition' }));
  });

  it('multiple', function () {
    assert(isNodeType(['SourceUnit', 'ContractDefinition'], { nodeType: 'SourceUnit' }));
    assert(isNodeType(['SourceUnit', 'ContractDefinition'], { nodeType: 'ContractDefinition' }));
    assert(!isNodeType(['SourceUnit', 'ContractDefinition'], { nodeType: 'ImportDirective' }));
  });

  it('single curried', function () {
    assert(isNodeType('SourceUnit')({ nodeType: 'SourceUnit' }));
  });

  it('multiple curried', function () {
    const curried = isNodeType(['SourceUnit', 'ContractDefinition']);
    assert(curried({ nodeType: 'SourceUnit' }));
    assert(curried({ nodeType: 'ContractDefinition' }));
  });
});

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

describe('src decoder', function () {
  const source = path.join(__dirname, 'sources/src-decoder.sol');

  before('reading and compiling source file', async function () {
    this.timeout(10 * 60 * 1000);
    const content = await fs.readFile(source, 'utf8');
    this.input = { sources: { 'file.sol': { content } } };
    this.output = await compile(latest, this.input.sources);
    this.ast = this.output.sources['file.sol'].ast;
  });

  it('ascii', function () {
    const decodeSrc = srcDecoder(this.input, this.output);
    const line5 = [...findAll('ContractDefinition', this.ast)].find(c => c.name === 'Line5');
    assert.strictEqual(decodeSrc(line5), 'file.sol:5');
  });

  it('multi-byte utf8', function () {
    const decodeSrc = srcDecoder(this.input, this.output);
    const line8 = [...findAll('ContractDefinition', this.ast)].find(c => c.name === 'Line8');
    assert.strictEqual(decodeSrc(line8), 'file.sol:8');
  });
});

describe('fast node info lookup', function () {
  const source = path.join(__dirname, 'sources/ast-deref.sol');

  before('reading and compiling source file', async function () {
    this.timeout(10 * 60 * 1000);
    const content = await fs.readFile(source, 'utf8');
    this.output = await compile(latest, { 0: { content } });
    this.ast = this.output.sources[0].ast;
    this.nodeInfoResolver = new NodeInfoResolver(this.output);
  });

  it('finds contracts', function () {
    for (const c of findAll('ContractDefinition', this.ast)) {
      const node = this.nodeInfoResolver.getNodeInfo(c.id).node;
      assert.strictEqual(c, node);
      assert.strictEqual(node.nodeType, 'ContractDefinition');
    }
  });

  it('finds functions', function () {
    for (const c of findAll('FunctionDefinition', this.ast)) {
      const node = this.nodeInfoResolver.getNodeInfo(c.id).node;
      assert.strictEqual(c, node);
      assert.strictEqual(node.nodeType, 'FunctionDefinition');
    }
  });

  it('errors on unknown id', function () {
    assert(
        (() => this.nodeInfoResolver.getNodeInfo(1e10) === undefined));
  });

  it('curried', function () {
    const c3 = [...findAll('ContractDefinition', this.ast)].find(c => c.name === 'C3');
    const baseContracts = c3.linearizedBaseContracts.map(
        (contractID) => {
          return this.nodeInfoResolver.getNodeInfo(contractID).node ?? '';
        });
    assert.deepEqual(baseContracts.map(c => c.name), ['C3', 'C2', 'C1']);
  });
});

