#!/usr/bin/env node

const json2ts = require('json-schema-to-typescript');
const fs = require('fs');

const schema = require('../schema.json');

json2ts.compile(schema, schema.title, {
  strictIndexSignatures: true,
  bannerComment: '/* tslint:disable */',
}).then(result => {
  fs.writeFileSync('types.d.ts', result);
}).catch(err => {
  console.error(err.stack);
  process.exit(1);
});
