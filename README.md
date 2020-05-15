# Solidity AST Types

[![NPM Package](https://img.shields.io/npm/v/solidity-ast.svg)](https://www.npmjs.org/package/solidity-ast)

**TypeScript types and a JSON Schema for the Solidity AST.**

```
npm install solidity-ast
```

```typescript
import type { SourceUnit, ContractDefinition } from 'solidity-ast';
```

The types included in the NPM package are automatically generated from the JSON
Schema, so you will not find them in the repository. You can see what they look
like on [unpkg].

[unpkg]: https://unpkg.com/solidity-ast@latest/types.d.ts

Expression nodes (like `UnaryOperation`, etc.) are not specified yet.
Everything above that level should be fully specified, for the latest version
of solc. Even with the missing expression detail, this should be very useful
for many use cases.

The current version was built for solc 0.6.8. In the short term this project
will serve to document the changes made to the AST across solc releases, and we
will explore the possibility of building adapters to consume ASTs independent
of the version that produced them.
