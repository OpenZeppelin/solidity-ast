const fs = require('fs/promises');
const path = require('path');
const assert = require('assert');
const fc = require('fast-check');

const { latest } = require('./helpers/solc-versions');
const { compile } = require('./helpers/solc-compile');

const { isNodeType, findAll, astDereferencer, srcDecoder } = require('../utils');

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
  const counts = {
    Block: 1,
    ContractDefinition: 1,
    ElementaryTypeName: 2,
    FunctionDefinition: 1,
    Identifier: 1,
    ImportDirective: 1,
    InlineAssembly: 1,
    ParameterList: 2,
    PragmaDirective: 1,
    SourceUnit: 1,
    StructDefinition: 2,
    VariableDeclaration: 2,
    YulBlock: 1,
    YulLiteral: 1,
    YulTypedName: 1,
    YulVariableDeclaration: 1,
  };

  const starCount = Object.values(counts).reduce((a, b) => a + b, 0);

  before('reading and compiling source file', async function () {
    this.timeout(10 * 60 * 1000);
    const output = await compile(latest, {
      ['find-all.sol']: { content: await fs.readFile(path.join(__dirname, 'sources/find-all.sol'), 'utf8') },
      ['import.sol']: { content: await fs.readFile(path.join(__dirname, 'sources/import.sol'), 'utf8') },
    });
    this.ast = output.sources['find-all.sol'].ast;
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
    fc.assert(
      fc.property(fc.shuffledSubarray(nodeTypes), nodeTypes => {
        const count = nodeTypes.map(t => counts[t]).reduce((a, b) => a + b, 0);
        const nodes = [...findAll(nodeTypes, this.ast)];
        assert.strictEqual(nodes.length, count);
      })
    );
  });

  it('star', function () {
    const nodes = [...findAll('*', this.ast)];
    assert.strictEqual(nodes.length, starCount);
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

describe('ast dereferencer with source unit', function () {
  const source0 = path.join(__dirname, 'sources/ast-deref.sol');
  const source1 = path.join(__dirname, 'sources/ast-deref-2.sol');

  before('reading and compiling source file', async function () {
    this.timeout(10 * 60 * 1000);
    const content0 = await fs.readFile(source0, 'utf8');
    const content1 = await fs.readFile(source1, 'utf8');
    this.output = await compile(latest, { 0: { content: content0 }, 1: { content: content1 } });
    this.ast = this.output.sources[0].ast;
  });


  it('finds contracts', function () {
    const deref = astDereferencer(this.output);
    for (const { ast } of Object.values(this.output.sources)) {
      for (const c of findAll('ContractDefinition', ast)) {
        const { node, sourceUnit } = deref.withSourceUnit('ContractDefinition', c.id);
        assert.strictEqual(c, node);
        assert.strictEqual(sourceUnit, ast);
      }
    }
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
