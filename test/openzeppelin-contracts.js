const test = require('ava');

const { assertValid } = require('./utils/assert-valid');

const { sources } = require('./openzeppelin-contracts.json');

for (const [ path, { ast } ] of Object.entries(sources)) {
  test(path, function () {
    assertValid(ast);
  });
}
