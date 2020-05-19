const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const lodash = require('lodash');
const chalk = require('chalk');
const util = require('util');

const ajv = new Ajv({ verbose: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
const validate = ajv.compile(require('./schema.json'));

describe('json samples from solidity repository', function () {
  const dir = 'solidity/test/libsolidity/ASTJSON';

  // we read all jsons except those marked legacy
  const inputs = fs.readdirSync(dir).filter(e => /^.*(?<!_legacy)\.json$/.test(e));

  for (const f of inputs) {
    const doc = JSON.parse(fs.readFileSync(path.resolve(dir, f), 'utf8'));
    // Some of these files are arrays so we use concat to treat them uniformly.
    for (const ast of [].concat(doc)) {
      it(f, function () {
        if (!validate(ast)) {
          const longest = lodash.maxBy(validate.errors, e => e.dataPath.split('.').length);
          throw new Error(formatError(longest, ast));
        }
      });
    }
  }
});

describe('openzeppelin contracts', function () {
  const { sources } = JSON.parse(fs.readFileSync('openzeppelin-contracts.json', 'utf8'));

  for (const [ path, { ast } ] of Object.entries(sources)) {
    it(path, function () {
      if (!validate(ast)) {
        const longest = lodash.maxBy(validate.errors, e => e.dataPath.split('.').length);
        throw new Error(formatError(longest, ast));
      }
    });
  }
});

function formatError(error, doc) {
  const pathComponents = error.dataPath.split('.');
  const nodeTree = pathComponents.map((c, i) => {
    const subPath = pathComponents.slice(1, i + 1).concat('nodeType').join('.');
    const nodeType = lodash.get(doc, subPath) || '';
    const indent = i === 0 ? '' : '   '.repeat(i - 1) + '└─';
    return lodash.compact([indent, nodeType, c && chalk.dim(c)]).join(' ');
  }).join('\n');

  const params = Object.values(error.params).join(', ');

  const dataString = util.inspect(error.data, { compact: false });

  return `${error.message} (${params})\n\n${nodeTree}\n\n${dataString}`;
}
