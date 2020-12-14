const fs = require('promisified/fs');
const path = require('path');

const { assertValid } = require('./helpers/assert-valid');

const dir = path.join(__dirname, 'solidity/test/libsolidity/ASTJSON');

describe('solidity submodule', function () {
  // we read all jsons except those marked legacy or parseOnly
  const inputs = fs.readdirSync(dir)
    .filter(e => /^.*(?<!_legacy|_parseOnly)\.json$/.test(e));

  before('read inputs', async function () {
    const contents = await Promise.all(inputs.map(f => fs.readFile(path.resolve(dir, f), 'utf8')));
    this.inputContents = {};
    for (const [i, content] of contents.entries()) {
      this.inputContents[inputs[i]] = content;
    }
  });

  for (const f of inputs) {
    it(f, function () {
      const text = this.inputContents[f];
      if (text.length === 0) return;
      const doc = JSON.parse(text);
      // Some of these files are arrays so we use concat to treat them uniformly.
      const asts = [].concat(doc);
      for (const ast of asts) {
        assertValid(ast);
      }
    });
  }
});
