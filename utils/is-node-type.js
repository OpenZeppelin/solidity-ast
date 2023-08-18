function isNodeType(nodeType, node) {
  return nodeType === node.nodeType ||
    nodeType === "*" ||
    (Array.isArray(nodeType) && nodeType.includes(node.nodeType));
}

module.exports = {
  isNodeType,
};
