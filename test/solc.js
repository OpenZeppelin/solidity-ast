const fs = require('fs/promises');
const path = require('path');
const semver = require('semver');
const lodash = require('lodash');

const { assertValid } = require('./helpers/assert-valid');
const { versions } = require('./helpers/solc-versions');
const { compile } = require('./helpers/solc-compile');

describe('solc', function () {
  this.timeout(10 * 60 * 1000);

  before('reading solidity sources', async function () {
    const files = await fs.readdir(path.join(__dirname, 'sources'));
    this.sources = {};
    this.sourceVersions = {};
    this.experimental = {};
    for (const file of files) {
      const content = await fs.readFile(
        path.join(__dirname, 'sources', file),
        'utf8',
      );
      this.sources[file] = { content };
      this.sourceVersions[file] = content.match(/pragma solidity (.*);/)[1];
      this.experimental[file] = /pragma experimental solidity;/.test(content);
    }
  });

  for (const version of versions) {
    it(version, async function () {
      const sources = lodash.pickBy(this.sources, (_, f) =>
        semver.satisfies(version, this.sourceVersions[f]) && !this.experimental[f],
      );
      const output = await compile(version, sources);
      for (const source of Object.keys(sources)) {
        assertValid(output.sources[source].ast, source);
      }

      const experimentalSources = lodash.pickBy(this.sources, (_, f) =>
        semver.satisfies(version, this.sourceVersions[f]) && this.experimental[f],
      );
      if (experimentalSources.length > 0) {
        const experimentalOutput = await compile(version, experimentalSources);
        for (const source of Object.keys(sources)) {
          assertValid(output.sources[source].ast, source);
        }
      }
    });
  }
});
