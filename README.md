# Solidity AST Types

[![NPM Package](https://img.shields.io/npm/v/solidity-ast.svg)](https://www.npmjs.org/package/solidity-ast)

**TypeScript types and a JSON Schema for the Solidity AST.**

_This is being actively developed and some types are still missing. Please try
it out and report the bugs that you find. Expression nodes are not released on
NPM yet._

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

The current version was built for solc 0.6.8. In the short term this project
will serve to document the changes made to the AST across solc releases, and we
will explore the possibility of building adapters to consume ASTs independent
of the version that produced them.
