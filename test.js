const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const lodash = require('lodash');

const ajv = new Ajv({ verbose: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
const validate = ajv.compile(require('./schema.json'));

describe('json samples from solidity repository', function () {
  const dir = 'solidity/test/libsolidity/ASTJSON';

  // we read all jsons except those marked legacy
  const inputs = fs.readdirSync(dir).filter(e => /^.*(?<!_legacy)\.json$/.test(e));

  for (const f of inputs) {
    if (f === 'documentation.json') continue; // invalid json here

    it(f, function () {
      const doc = require(path.resolve(dir, f));
      if (!validate(doc)) {
        const longest = lodash.maxBy(validate.errors, e => e.dataPath.split('.').length);
        throw new Error(formatError(longest, doc));
      }
    });
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
  const { params, message, data, dataPath } = error;
  const path = dataPath.slice(1);

  const pathComponents = path.split('.');
  const nodeTypes = pathComponents.map((_, i) => {
    const subPath = pathComponents.slice(0, i).concat('nodeType').join('.');
    return lodash.get(doc, subPath);
  }).join(' > ');

  fs.writeFileSync('failed.json', JSON.stringify(doc));

  return JSON.stringify({
    message,
    params,
    dataPath,
    nodeTypes,
    data,
  }, null, 2);
}
