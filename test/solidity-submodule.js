const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { test } = require('node:test');

const { assertValid } = require('./helpers/assert-valid');

const dir = path.join(__dirname, 'solidity/test/libsolidity/ASTJSON');

test('solidity submodule', async function (t) {
  assert(fs.existsSync(dir), 'initialize the test/solidity submodule to run this test');
  // we read all jsons except those marked legacy or parseOnly
  const inputs = fs.readdirSync(dir)
    .filter(e => /^.*(?<!_legacy|_parseOnly)\.json$/.test(e));
  const contents = await Promise.all(inputs.map(f => fs.promises.readFile(path.resolve(dir, f), 'utf8')));
  const inputContents = {};
  for (const [i, content] of contents.entries()) {
    inputContents[inputs[i]] = content;
  }

  for (const f of inputs) {
    await t.test(f, function () {
      const text = inputContents[f];
      if (text.length === 0) return;
      const doc = JSON.parse(text.replace(/%EVMVERSION%/g, JSON.stringify('berlin')));
      // Some of these files are arrays so we use concat to treat them uniformly.
      const asts = [].concat(doc);
      for (const ast of asts) {
        assertValid(ast);
      }
    });
  }
});
