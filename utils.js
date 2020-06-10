const finder = require('./finder.json');

function isNodeType(nodeType, node) {
  if (node === undefined) {
    return node => node.nodeType === nodeType;
  } else {
    return node.nodeType === nodeType;
  }
}

function* findAll(node, nodeType) {
  if (node.nodeType === nodeType) {
    yield node;
  }

  if (node.nodeType in finder[nodeType]) {
    for (const prop of finder[nodeType][node.nodeType]) {
      const member = node[prop];
      if (Array.isArray(member)) {
        for (const sub2 of member) {
          yield* findAll(sub2, nodeType);
        }
      } else {
        yield* findAll(member, nodeType);
      }
    }
  }
}

module.exports = {
  isNodeType,
  findAll,
};
