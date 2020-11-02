#!/usr/bin/env node
'use strict';

const fs = require('fs');
const _ = require('lodash');

const reachable = {};

const schema = require('../schema.json');

for (const def of Object.values(schema.definitions).concat(schema)) {
  if ('properties' in def && 'nodeType' in def.properties) {
    const parentType = def.properties.nodeType.enum[0];
    _.defaults(reachable, { [parentType]: {} });

    for (const prop in def.properties) {
      for (const containedType of getReachableNodeTypes(def.properties[prop])) {
        _.set(reachable, [containedType, parentType, prop], true);
      }
    }
  }
}

const finder = _.mapValues(reachable, f => _.mapValues(f, Object.keys));

fs.writeFileSync('finder.json', JSON.stringify(finder, null, 2));

function* getReachableNodeTypes(nodeSchema, visited = new Set()) {
  yield* _.get(nodeSchema, ['properties', 'nodeType', 'enum'], []);

  if ('$ref' in nodeSchema) {
    const [ ref ] = nodeSchema['$ref'].match(/[^\/]+$/);
    if (!visited.has(ref)) {
      visited.add(ref);
      yield* getReachableNodeTypes(schema.definitions[ref], visited);
    }
  }

  if ('anyOf' in nodeSchema) {
    for (const subSchema of nodeSchema['anyOf']) {
      yield* getReachableNodeTypes(subSchema, visited);
    }
  }

  if ('properties' in nodeSchema) {
    for (const prop of Object.values(nodeSchema.properties)) {
      yield* getReachableNodeTypes(prop, visited);
    }
  }

  if ('items' in nodeSchema) {
    yield* getReachableNodeTypes(nodeSchema.items, visited);
  }
}
