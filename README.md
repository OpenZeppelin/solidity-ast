# Solidity AST Types

[![Docs](https://img.shields.io/badge/docs-%F0%9F%93%84-blue)][docs]
[![NPM Package](https://img.shields.io/npm/v/solidity-ast.svg)](https://www.npmjs.org/package/solidity-ast)

**TypeScript types and a JSON Schema for the Solidity AST.**

_The latest version successfully validates all of [OpenZeppelin Contracts], but
some types may still be inaccurate. Please report any issues you find._

[OpenZeppelin Contracts]: https://github.com/OpenZeppelin/openzeppelin-contracts

```
npm install solidity-ast
```


```typescript
import type { SourceUnit, ContractDefinition } from 'solidity-ast';
```

The types included in the NPM package are automatically generated from the JSON
Schema, so you will not find them in the repository. You can see what they look
like on [unpkg] or the [documentation][docs].

[unpkg]: https://unpkg.com/solidity-ast@latest/types.d.ts
[docs]: https://solidity-ast.netlify.app/

## Solidity Versioning

The package at the moment was built for Solidity 0.6.8, so the types may not be
accurate for other Solidity versions.

The plan is to provide the types for every version and additionally an adapter
that can be used to consume ASTs with a stable interface regardless of the
Solidity version that produced them.

## Utilities

Included in the package is a set of utility function for type-safe interactions
with nodes based on the node type.

### `isNodeType(nodeType, node)`

A type predicate that can be used for narrowing the type of an
unknown node, or combined with higher order functions like `filter`.

```typescript
import { isNodeType } from 'solidity-ast/utils';

if (isNodeType('ContractDefinition', node)) {
  // node: ContractDefinition
}

const contractDefs = sourceUnit.nodes.filter(isNodeType('ContractDefinition'));
  // contractDefs: ContractDefinition[]
```

### `findAll(nodeType, node)`

`findAll` is a generator function that will recursively enumerate all
descendent nodes of a given node type. It does this in an efficient way by
visiting only the nodes that are necessary for the searched node type.

```typescript
import { findAll } from 'solidity-ast/utils';

for (const functionDef of findAll('FunctionDefinition', sourceUnit)) {
  // functionDef: FunctionDefinition
}
```
