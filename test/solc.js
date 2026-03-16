const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const semver = require('semver');
const lodash = require('lodash');
const { test } = require('node:test');

const { assertValid } = require('./helpers/assert-valid');
const { versions } = require('./helpers/solc-versions');
const { compile } = require('./helpers/solc-compile');

test('solc', {
  timeout: 10 * 60 * 1000,
  concurrency: Math.max(1, os.availableParallelism() - 1),
}, async function (t) {
  const files = await fs.readdir(path.join(__dirname, 'sources'));
  const allSources = {};
  const sourceVersions = {};
  const experimental = {};
  for (const file of files) {
    const content = await fs.readFile(
      path.join(__dirname, 'sources', file),
      'utf8',
    );
    allSources[file] = { content };
    sourceVersions[file] = content.match(/pragma solidity (.*);/)[1];
    experimental[file] = /pragma experimental solidity;/.test(content);
  }

  await Promise.all(versions.map(version =>
    t.test(version, async function () {
      const sources = lodash.pickBy(allSources, (_, f) =>
        semver.satisfies(version, sourceVersions[f]) && !experimental[f],
      );
      const output = await compile(version, sources);
      for (const source of Object.keys(sources)) {
        assertValid(output.sources[source].ast, source);
      }

      const experimentalSources = lodash.pickBy(allSources, (_, f) =>
        semver.satisfies(version, sourceVersions[f]) && experimental[f],
      );
      if (Object.keys(experimentalSources).length > 0) {
        const experimentalOutput = await compile(version, experimentalSources);
        for (const source of Object.keys(experimentalSources)) {
          assertValid(experimentalOutput.sources[source].ast, source);
        }
      }
    })
  ));
});
