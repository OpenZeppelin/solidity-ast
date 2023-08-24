#!/usr/bin/env node

// @ts-check
'use strict';

const fs = require('fs');
const _ = require('lodash');

const reachable = {};

const schema = require('../schema.json');

for (const def of [...Object.values(schema.definitions), schema]) {
  if ('properties' in def && 'nodeType' in def.properties) {
    const parentType = def.properties.nodeType.enum[0];
    _.defaults(reachable, { [parentType]: {} });

    for (const prop in def.properties) {
      for (const contained of getReachableNodeTypes(def.properties[prop])) {
        _.set(reachable, [contained.nodeType, parentType, prop], true);
        _.set(reachable, ['*', parentType, prop], true);
        for (const nonNodeParent of contained.nonNodeParents) {
          _.set(reachable, [contained.nodeType, '$other', nonNodeParent], true);
          _.set(reachable, ['*', '$other', nonNodeParent], true);
        }
      }
    }
  }
}

const finder = _.mapValues(reachable, f => _.mapValues(f, Object.keys));

fs.writeFileSync('finder.json', JSON.stringify(finder, null, 2));

function* getReachableNodeTypes(nodeSchema, nonNodeParents = [], visited = new Set()) {
  const nodeTypes = nodeSchema?.properties?.nodeType?.enum;

  if (nodeTypes) {
    yield* nodeTypes.map(nodeType => ({ nodeType, nonNodeParents }));
  }

  if ('$ref' in nodeSchema) {
    const [ ref ] = nodeSchema['$ref'].match(/[^\/]+$/);
    if (!visited.has(ref)) {
      visited.add(ref);
      yield* getReachableNodeTypes(schema.definitions[ref], nonNodeParents, visited);
    }
  }

  if ('anyOf' in nodeSchema) {
    for (const subSchema of nodeSchema['anyOf']) {
      yield* getReachableNodeTypes(subSchema, nonNodeParents, visited);
    }
  }

  if ('properties' in nodeSchema) {
    for (const [subprop, subpropSchema] of Object.entries(nodeSchema.properties)) {
      if (!nodeTypes) {
        nonNodeParents.push(subprop);
      }
      yield* getReachableNodeTypes(subpropSchema, nonNodeParents, visited);
      if (!nodeTypes) {
        nonNodeParents.pop();
      }
    }
  }

  if ('items' in nodeSchema) {
    yield* getReachableNodeTypes(nodeSchema.items, nonNodeParents, visited);
  }
}
