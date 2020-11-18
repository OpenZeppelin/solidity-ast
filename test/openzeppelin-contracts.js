const { assertValid } = require('./utils/assert-valid');

const { sources } = require('./openzeppelin-contracts.json');

describe('openzeppelin contracts', function () {
  for (const [ path, { ast } ] of Object.entries(sources)) {
    it(path, function () {
      assertValid(ast);
    });
  }
});
