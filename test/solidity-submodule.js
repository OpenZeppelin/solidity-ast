const test = require('ava');
const fs = require('promisified/fs');
const path = require('path');

const { assertValid } = require('./utils/assert-valid');

const dir = path.join(__dirname, 'solidity/test/libsolidity/ASTJSON');

// we read all jsons except those marked legacy or parseOnly
const inputs = fs.readdirSync(dir)
  .filter(e => /^.*(?<!_legacy|_parseOnly)\.json$/.test(e));

for (const f of inputs) {
  const text = fs.readFileSync(path.resolve(dir, f), 'utf8');
  if (text.length === 0) continue;
  const doc = JSON.parse(text);
  // Some of these files are arrays so we use concat to treat them uniformly.
  const asts = [].concat(doc);
  for (const [i, ast] of asts.entries()) {
    const title = asts.length === 1 ? f : f + ` (${i})`;
    test(title, () => {
      assertValid(ast);
    });
  }
}
