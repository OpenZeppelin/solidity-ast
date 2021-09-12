#!/usr/bin/env node

// @ts-check
'use strict';

const fs = require('fs');
const schema = require('../schema.json');

const referrers = [];

for (const def of Object.values(schema.definitions)) {
  if ('properties' in def && 'referencedDeclaration' in def.properties) {
    referrers.push(...def.properties.nodeType.enum);
  }
}

fs.writeFileSync('referrers.js', `module.exports = ${JSON.stringify(referrers)};`);
fs.writeFileSync('referrers.d.ts', [
  `declare const referrers: ${referrers.map(r => JSON.stringify(r)).join(' | ')};`,
  `export default referrers;`,
].join('\n'));
