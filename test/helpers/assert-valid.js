const Ajv = require('ajv');
const lodash = require('lodash');
const chalk = require('chalk');
const util = require('util');

const ajv = new Ajv({ verbose: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
const validate = ajv.compile(require('../../scripts/build-schema'));

function assertValid(ast, file) {
  if (!validate(ast)) {
    const longest = lodash.maxBy(validate.errors, e => e.instancePath.split('/').length);
    throw new Error(formatError(longest, ast, file));
  }
}

function formatError(error, doc, file) {
  const pathComponents = error.instancePath.split('/');
  const nodeTree = pathComponents.map((c, i) => {
    const subPath = pathComponents.slice(1, i + 1).concat('nodeType').join('.');
    const nodeType = lodash.get(doc, subPath) || '';
    const indent = i === 0 ? '' : '   '.repeat(i - 1) + '└─';
    if (nodeType === 'SourceUnit') c = file;
    return lodash.compact([indent, nodeType, c && chalk.dim(c)]).join(' ');
  }).join('\n');

  const params = Object.values(error.params).join(', ');

  const dataString = util.inspect(error.data, { compact: false, depth: 1 });

  return `${error.message} (${params})\n\n${nodeTree}\n\n${dataString}`;
}

module.exports = { assertValid };
