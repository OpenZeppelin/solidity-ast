const finder = require('../finder.json');

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
  const next = new Set();
  for (const wantedNodeType of wantedNodeTypes) {
    const wantedFinder = finder[wantedNodeType];
    if (wantedFinder && currentNodeType in wantedFinder) {
      for (const nextNodeType of wantedFinder[currentNodeType]) {
        next.add(nextNodeType);
      }
    }
  }
  return next;
}

module.exports = {
  findAll,
};
