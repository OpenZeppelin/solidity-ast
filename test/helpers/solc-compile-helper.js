if (process.send === undefined) {
  throw new Error('Must run via child_process.fork');
}

const events = require('events');

process.once('message', async ({ version, sources }) => {
  const solc = require(`solc-${version}`);

  // version() returns something like '0.8.13+commit.abaa5c0e.Emscripten.clang'
  const [trueVersion] = solc.version().split('+');

  let output;

  if (trueVersion !== version) {
    output = {
      errors: [
        { formattedMessage: `Package solc-${version} is actually solc@${trueVersion}` },
      ],
    };
  } else {
    output = JSON.parse(
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
  }

  process.send(output);
});
