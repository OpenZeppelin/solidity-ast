if (process.send === undefined) {
  throw new Error('Must run via child_process.fork');
}

const events = require('events');

process.once('message', async ({ version, sources }) => {
  const solc = require(`solc-${version}`);
  const output = JSON.parse(
    solc.compile(
      JSON.stringify({
        sources,
        language: 'Solidity',
        settings: {
          outputSelection: { '*': { '': ['ast'] } },
        },
      })
    )
  );
  process.send(output);
});
