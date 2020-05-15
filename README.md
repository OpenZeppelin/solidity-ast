# Solidity AST Types

[![NPM Package](https://img.shields.io/npm/v/solidity-ast.svg)](https://www.npmjs.org/package/solidity-ast)

**TypeScript types and a JSON Schema for the Solidity AST.**

```
npm install solidity-ast
```

```typescript
import type { SourceUnit, ContractDefinition } from 'solidity-ast';

function getContractNames(ast: SourceUnit): string[] {
  const names = [];
  for (const node of ast.nodes) {
    if (node.nodeType === 'ContractDefinition') {
      names.push(node.name);
    }
  }
  return names;
}
```

Expression nodes (like `UnaryOperation`, etc.) are not specified yet.
Everything above that level should be fully specified, for the latest version
of solc. Even with the missing expression detail, this should be very useful
for many use cases.

In the short term this project will serve to document the changes made to the
AST across solc releases, and we will explore the possibility of building
adapters to consume ASTs independent of the version that produced them.
