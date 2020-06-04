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

## Predicates

Included in the package is a set of predicates with type guards that can be
used to filter a list of nodes in a type safe way.

```typescript
import type { ContractDefinition } from 'solidity-ast';
import { isContractDefinition } from 'solidity-ast/predicates';

const contractDefs: ContractDefintion[] = sourceUnit.nodes.filter(isContractDefinition);
```
