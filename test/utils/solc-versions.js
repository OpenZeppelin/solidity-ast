const semver = require('semver');

const versions = Object.keys(require('../../package.json').devDependencies)
  .filter(s => s.startsWith('solc-'))
  .map(s => s.replace('solc-', ''))
  .sort(semver.compare);

const latest = versions[versions.length - 1];

module.exports = { versions, latest };
