#!/usr/bin/env node

// @ts-check
'use strict';

const fs = require('fs');
const schema = require('../schema.json');

const nodeTypesSet = new Set(schema.properties.nodeType.enum);

for (const def of Object.values(schema.definitions)) {
  if ('properties' in def && 'nodeType' in def.properties) {
    for (const type of def.properties.nodeType.enum) {
      nodeTypesSet.add(type);
    }
  }
}

const nodeTypes = [...nodeTypesSet];

const lines = [];

lines.push(`import type {${nodeTypes.join(', ')}} from './types';`);
lines.push(`export type Node = ${nodeTypes.join(' | ')};`)
lines.push(`export type NodeTypeMap = { ${nodeTypes.map(t => [t, t].join(': ')).join(', ')} };`);
lines.push(`export type NodeType = keyof NodeTypeMap;`);

fs.writeFileSync('node.d.ts', lines.join('\n'));
