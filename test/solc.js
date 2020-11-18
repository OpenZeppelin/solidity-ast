const test = require('ava');
const fs = require('promisified/fs');
const path = require('path');
const proc = require('child_process');
const events = require('events');
const semver = require('semver');
const lodash = require('lodash');

const { assertValid } = require('./utils/assert-valid');

const versions = Object.keys(require('../package.json').devDependencies)
  .filter(s => s.startsWith('solc-'))
  .map(s => s.replace('solc-', ''))
  .sort(semver.compare);

test.before('reading solidity sources', async t => {
  const files = await fs.readdir(path.join(__dirname, 'sources'));
  t.context.sources = {};
  t.context.sourceVersions = {};
  for (const file of files) {
    const content = await fs.readFile(
      path.join(__dirname, 'sources', file),
      'utf8',
    );
    t.context.sources[file] = { content };
    t.context.sourceVersions[file] = content.match(/pragma solidity (.*);/)[1];
  }
});

for (const version of versions) {
  test(version, async t => {
    const sources = lodash.pickBy(t.context.sources, (_, f) =>
      semver.satisfies(version, t.context.sourceVersions[f]),
    );
    const child = proc.fork(require.resolve('./utils/solc-helper'));
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
