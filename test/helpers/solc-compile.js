const proc = require('child_process');
const events = require('events');
const lodash = require('lodash');

async function compile(version, sources) {
  const child = proc.fork(require.resolve('./solc-compile-helper'));
  child.send({ version, sources });
  const [output] = await events.once(child, 'message');

  // allows tests to exit as soon as they finish
  // otherwise solc module delays exit
  child.disconnect();
  child.unref();

  if (output.errors && output.errors.some(e => e.severity !== 'warning')) {
    throw new Error(lodash.map(output.errors, 'formattedMessage').join('\n'));
  }
  return output;
}

module.exports = { compile };
