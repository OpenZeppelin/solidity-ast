const finder = require('./finder.json');

function isNodeType(nodeType, node) {
  return node.nodeType === nodeType;
}

function* findAll(nodeType, node) {
  if (node.nodeType === nodeType) {
    yield node;
  }

  if (node.nodeType in finder[nodeType]) {
    for (const prop of finder[nodeType][node.nodeType]) {
      const member = node[prop];
      if (Array.isArray(member)) {
        for (const sub2 of member) {
          yield* findAll(nodeType, sub2);
        }
      } else {
        yield* findAll(nodeType, member);
      }
    }
  }
}

function curry2(fn) {
  return function (nodeType, node) {
    if (node === undefined) {
      return node => fn(nodeType, node);
    } else {
      return fn(nodeType, node);
    }
  };
}

module.exports = {
  isNodeType: curry2(isNodeType),
  findAll: curry2(findAll),
};
