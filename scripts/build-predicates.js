#!/usr/bin/env node
/// @ts-check
'use strict';

const schema = require('../schema.json');

/** @type {string[]} */
const nodeTypes = ['SourceUnit'];

for (const def of Object.values(schema.definitions)) {
  if ('properties' in def && 'nodeType' in def.properties) {
    nodeTypes.push(...def.properties.nodeType.enum);
  }
}

console.log(`import type {${nodeTypes.join(', ')}} from './types';`);

console.log(`type SolidityNode = ${nodeTypes.join(' | ')};`)

for (const nodeType of nodeTypes) {
  console.log(
`export function is${nodeType}(node: SolidityNode): node is ${nodeType} {
  return node.nodeType === '${nodeType}';
}`
  );
}
