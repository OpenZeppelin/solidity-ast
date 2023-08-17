const finder = require('../finder.json');

const nextPropsCache = new Map();

function findAll(nodeType, node, prune) {
  let cache;

  if (Array.isArray(nodeType)) {
    const cacheKey = JSON.stringify(nodeType);
    cache = nextPropsCache.get(cacheKey);
    if (!cache) {
      cache = {};
      nextPropsCache.set(cacheKey, cache);
    }
  }

  return (
    function* findAllInner(node) {
      if (typeof node !== 'object' || (prune && prune(node))) {
        return;
      }

      if (
        nodeType === node.nodeType ||
        nodeType === "*" ||
        (Array.isArray(nodeType) && nodeType.includes(node.nodeType))
      ) {
        yield node;
      }

      for (const prop of getNextProps(nodeType, node.nodeType ?? '$other', cache)) {
        const member = node[prop];
        if (Array.isArray(member)) {
          for (const sub2 of member) {
            if (sub2) {
              yield* findAllInner(sub2);
            }
          }
        } else if (member) {
          yield* findAllInner(member);
        }
      }
    }
  )(node);
}

function getNextProps(wantedNodeTypes, currentNodeType, cache) {
  if (typeof wantedNodeTypes === 'string') {
    return finder[wantedNodeTypes][currentNodeType] ?? [];
  }
  if (currentNodeType in cache) {
    return cache[currentNodeType];
  }
  const next = new Set();
  for (const wantedNodeType of wantedNodeTypes) {
    const wantedFinder = finder[wantedNodeType];
    if (wantedFinder && currentNodeType in wantedFinder) {
      for (const nextNodeType of wantedFinder[currentNodeType]) {
        next.add(nextNodeType);
      }
    }
  }
  return cache[currentNodeType] = [...next];
}

module.exports = {
  findAll,
};
