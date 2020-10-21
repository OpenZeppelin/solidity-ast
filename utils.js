const finder = require('./finder.json');

function isNodeType(nodeType, node) {
  return node.nodeType === nodeType;
}

function* findAll(nodeType, node, prune) {
  if (prune && prune(node)) {
    return;
  }

  if (node.nodeType === nodeType) {
    yield node;
  }

  if (node.nodeType in finder[nodeType]) {
    for (const prop of finder[nodeType][node.nodeType]) {
      const member = node[prop];
      if (Array.isArray(member)) {
        for (const sub2 of member) {
          if (sub2) {
            yield* findAll(nodeType, sub2);
          }
        }
      } else if (member) {
        yield* findAll(nodeType, member);
      }
    }
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

module.exports = {
  isNodeType: curry2(isNodeType),
  findAll: curry2(findAll),
};
