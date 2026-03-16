const fs = require('fs/promises');
const path = require('path');
const assert = require('assert');
const fc = require('fast-check');
const { describe, it, test } = require('node:test');

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

test('findAll', { timeout: 10 * 60 * 1000 }, async function (t) {
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

  const output = await compile(latest, {
    ['find-all.sol']: { content: await fs.readFile(path.join(__dirname, 'sources/find-all.sol'), 'utf8') },
    ['import.sol']: { content: await fs.readFile(path.join(__dirname, 'sources/import.sol'), 'utf8') },
  });
  const { ast } = output.sources['find-all.sol'];

  await t.test('basic', function () {
    for (const nodeType in counts) {
      const nodes = [...findAll(nodeType, ast)];
      assert.strictEqual(nodes.length, counts[nodeType]);
    }
  });

  await t.test('curried', function () {
    const nodeType = 'StructDefinition';
    const nodes = [...findAll(nodeType)(ast)];
    assert.strictEqual(nodes.length, counts[nodeType]);
  });

  await t.test('multiple', function () {
    const nodeTypes = Object.keys(counts);
    fc.assert(
      fc.property(fc.shuffledSubarray(nodeTypes), nodeTypes => {
        const count = nodeTypes.map(t => counts[t]).reduce((a, b) => a + b, 0);
        const nodes = [...findAll(nodeTypes, ast)];
        assert.strictEqual(nodes.length, count);
      })
    );
  });

  await t.test('star', function () {
    const nodes = [...findAll('*', ast)];
    assert.strictEqual(nodes.length, starCount);
  });
});

test('ast dereferencer', { timeout: 10 * 60 * 1000 }, async function (t) {
  const source = path.join(__dirname, 'sources/ast-deref.sol');
  const content = await fs.readFile(source, 'utf8');
  const output = await compile(latest, { 0: { content } });
  const ast = output.sources[0].ast;

  await t.test('finds contracts', function () {
    const deref = astDereferencer(output);
    for (const c of findAll('ContractDefinition', ast)) {
      assert.strictEqual(c, deref('ContractDefinition', c.id));
    }
  });

  await t.test('finds functions', function () {
    const deref = astDereferencer(output);
    for (const c of findAll('FunctionDefinition', ast)) {
      assert.strictEqual(c, deref('FunctionDefinition', c.id));
    }
  });

  await t.test('cache works', function () {
    const deref = astDereferencer(output);
    const [c1] = findAll('ContractDefinition', ast);
    assert.strictEqual(c1, deref('ContractDefinition', c1.id));
    assert.strictEqual(c1, deref('ContractDefinition', c1.id));
  });

  await t.test('errors on wrong type', function () {
    const deref = astDereferencer(output);
    const [c1] = findAll('ContractDefinition', ast);
    assert.throws(
      () => deref('FunctionDefinition', c1.id),
      { message: /^No node with id \d+ of type FunctionDefinition$/ },
    );
  });

  await t.test('errors on unknown id', function () {
    const deref = astDereferencer(output);
    assert.throws(
      () => deref('FunctionDefinition', 1e10),
      { message: /^No node with id \d+ of type FunctionDefinition$/ },
    );
  });

  await t.test('multiple node types', function () {
    const deref = astDereferencer(output);
    const [c1] = findAll('ContractDefinition', ast);
    const [f1] = findAll('FunctionDefinition', ast);
    assert.strictEqual(c1, deref(['ContractDefinition', 'FunctionDefinition'], c1.id));
    assert.strictEqual(f1, deref(['ContractDefinition', 'FunctionDefinition'], f1.id));
  });

  await t.test('curried', function () {
    const deref = astDereferencer(output);
    const c3 = [...findAll('ContractDefinition', ast)].find(c => c.name === 'C3');
    const baseContracts = c3.linearizedBaseContracts.map(deref('ContractDefinition'));
    assert.deepEqual(baseContracts.map(c => c.name), ['C3', 'C2', 'C1']);
  });
});

test('ast dereferencer with source unit', { timeout: 10 * 60 * 1000 }, async function (t) {
  const source0 = path.join(__dirname, 'sources/ast-deref.sol');
  const source1 = path.join(__dirname, 'sources/ast-deref-2.sol');
  const content0 = await fs.readFile(source0, 'utf8');
  const content1 = await fs.readFile(source1, 'utf8');
  const output = await compile(latest, { 0: { content: content0 }, 1: { content: content1 } });

  await t.test('finds contracts', function () {
    const deref = astDereferencer(output);
    for (const { ast: astSourceUnit } of Object.values(output.sources)) {
      for (const c of findAll('ContractDefinition', astSourceUnit)) {
        const { node, sourceUnit } = deref.withSourceUnit('ContractDefinition', c.id);
        assert.strictEqual(c, node);
        assert.strictEqual(sourceUnit, astSourceUnit);
      }
    }
  });
});

test('src decoder', { timeout: 10 * 60 * 1000 }, async function (t) {
  const source = path.join(__dirname, 'sources/src-decoder.sol');
  const content = await fs.readFile(source, 'utf8');
  const input = { sources: { 'file.sol': { content } } };
  const output = await compile(latest, input.sources);
  const ast = output.sources['file.sol'].ast;

  await t.test('ascii', function () {
    const decodeSrc = srcDecoder(input, output);
    const line5 = [...findAll('ContractDefinition', ast)].find(c => c.name === 'Line5');
    assert.strictEqual(decodeSrc(line5), 'file.sol:5');
  });

  await t.test('multi-byte utf8', function () {
    const decodeSrc = srcDecoder(input, output);
    const line8 = [...findAll('ContractDefinition', ast)].find(c => c.name === 'Line8');
    assert.strictEqual(decodeSrc(line8), 'file.sol:8');
  });
});
