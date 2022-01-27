const finder = require('./finder.json');

function isNodeType(nodeType, node) {
  if (Array.isArray(nodeType)) {
    return nodeType.includes(node.nodeType);
  } else {
    return node.nodeType === nodeType;
  }
}

function* findAll(nodeType, node, prune) {
  if (!Array.isArray(nodeType)) {
    nodeType = [nodeType];
  }

  if (prune && prune(node)) {
    return;
  }

  if (nodeType.includes(node.nodeType)) {
    yield node;
  }

  for (const prop of getNextProps(nodeType, node.nodeType)) {
    const member = node[prop];
    if (Array.isArray(member)) {
      for (const sub2 of member) {
        if (sub2) {
          yield* findAll(nodeType, sub2, prune);
        }
      }
    } else if (member) {
      yield* findAll(nodeType, member, prune);
    }
  }
}

function getNextProps(wantedNodeTypes, currentNodeType) {
  if (wantedNodeTypes.length === 1) {
    return finder[wantedNodeTypes[0]][currentNodeType] || [];
  } else {
    const next = new Set();
    for (const wantedNodeType of wantedNodeTypes) {
      if (currentNodeType in finder[wantedNodeType]) {
        for (const nextNodeType of finder[wantedNodeType][currentNodeType]) {
          next.add(nextNodeType);
        }
      }
    }
    return next;
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
module.exports.findAll = curry2(findAll);

const { astDereferencer } = require('./dist/ast-dereferencer');

module.exports.astDereferencer = astDereferencer;
