const fs = require('promisified/fs');
const path = require('path');
const https = require('https');
const stream = require('promisified/stream');
const Ajv = require('ajv');
const lodash = require('lodash');
const chalk = require('chalk');
const util = require('util');
const assert = require('assert');
const proc = require('child_process');
const events = require('events');
const semver = require('semver');

const ajv = new Ajv({ verbose: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
const validate = ajv.compile(require('../schema.json'));

function assertValid(ast, file) {
  if (!validate(ast)) {
    const longest = lodash.maxBy(validate.errors, e => e.dataPath.split('.').length);
    throw new Error(formatError(longest, ast, file));
  }
}

describe('schema', function () {
  describe('demo contract with solc wasm', function () {
    const versions = Object.keys(require('../package.json').devDependencies)
      .filter(s => s.startsWith('solc-'))
      .map(s => s.replace('solc-', ''))
      .sort(semver.compare);

    before('reading solidity sources', async function () {
      const files = await fs.readdir(path.join(__dirname, 'sources'));
      this.sources = {};
      this.sourceVersions = {};
      for (const file of files) {
        const content = await fs.readFile(path.join(__dirname, 'sources', file), 'utf8');
        this.sources[file] = { content };
        this.sourceVersions[file] = content.match(/pragma solidity (.*);/)[1];
      }
    });

    for (const version of versions) {
      it(version, async function () {
        this.timeout(0);
        const sources = lodash.pickBy(this.sources, (_, f) => semver.satisfies(version, this.sourceVersions[f]));
        const child = proc.fork(require.resolve('../solc-helper'));
        child.send({ version, sources });
        const [output] = await events.once(child, 'message');
        if (output.errors && output.errors.some(e => e.severity !== 'warning')) {
          throw new Error(lodash.map(output.errors, 'formattedMessage').join('\n'));
        }
        for (const source of Object.keys(sources)) {
          assertValid(output.sources[source].ast, source);
        }
      });
    }
  });

  describe('json samples from solidity repository', function () {
    const dir = path.join(__dirname, 'solidity/test/libsolidity/ASTJSON');

    // we read all jsons except those marked legacy or parseOnly
    const inputs = fs.readdirSync(dir)
      .filter(e => /^.*(?<!_legacy|_parseOnly)\.json$/.test(e));

    for (const f of inputs) {
      const text = fs.readFileSync(path.resolve(dir, f), 'utf8');
      if (text.length === 0) continue;
      const doc = JSON.parse(text);
      // Some of these files are arrays so we use concat to treat them uniformly.
      for (const ast of [].concat(doc)) {
        it(f, function () {
          assertValid(ast);
        });
      }
    }
  });

  describe('openzeppelin contracts', function () {
    const { sources } = require('./openzeppelin-contracts.json');

    for (const [ path, { ast } ] of Object.entries(sources)) {
      it(path, function () {
        assertValid(ast);
      });
    }
  });
});

function formatError(error, doc, file) {
  const pathComponents = error.dataPath.split('.');
  const nodeTree = pathComponents.map((c, i) => {
    const subPath = pathComponents.slice(1, i + 1).concat('nodeType').join('.');
    const nodeType = lodash.get(doc, subPath) || '';
    const indent = i === 0 ? '' : '   '.repeat(i - 1) + '└─';
    if (nodeType === 'SourceUnit') c = file;
    return lodash.compact([indent, nodeType, c && chalk.dim(c)]).join(' ');
  }).join('\n');

  const params = Object.values(error.params).join(', ');

  const dataString = util.inspect(error.data, { compact: false, depth: null });

  return `${error.message} (${params})\n\n${nodeTree}\n\n${dataString}`;
}
