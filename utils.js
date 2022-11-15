function isNodeType(nodeType, node) {
  if (Array.isArray(nodeType)) {
    return nodeType.includes(node.nodeType);
  } else {
    return node.nodeType === nodeType;
  }
}

function curry2(fn) {
  return function (nodeType, ...args) {
    if (args.length === 0) {
      return node => fn(nodeType, node);
    } else {
      return fn(nodeType, ...args);
    }
  };
}

module.exports.isNodeType = curry2(isNodeType);
module.exports.findAll = curry2(require('./utils/find-all').findAll);

const { astDereferencer } = require('./dist/ast-dereferencer');
module.exports.astDereferencer = astDereferencer;

const { srcDecoder } = require('./dist/src-decoder');
module.exports.srcDecoder = srcDecoder;
