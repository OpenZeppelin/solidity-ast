# Changelog

### 0.4.10 (2020-10-15)

- Added `VariableDeclaration.documentation`, which is available since Solidity 0.6.9.

### 0.4.9 (2020-10-15)

- Added `TryStatement` as a new type of statement node.

### 0.4.8 (2020-10-15)

- Fixed types of `ForStatement` properties `condition`, `initializationExpression`, `loopExpression`, allowing them to be empty.
- Fixed type of `ForStatement.initializationExpression` to also potentially contain an `ExpressionStatement`.

### 0.4.7 (2020-10-14)

- `NewExpression.isLValue` and `FunctionCallOptions.isLValue` are now optional.

Due to a bug in Solidity 0.7.2, these two properties are missing in the ASTs produced by that version. In order for the types to remain accurate, they have been made optional. When the property is missing its value should be assumed to be `false` (see [ethereum/solidity#9953](https://github.com/ethereum/solidity/pull/9953)).

### 0.4.6 (2020-10-14)

- Fix type of `ModifierInvocation.arguments`.

### 0.4.5 (2020-10-14)

- Disable `additionalProperties` in `Conditional` node.
- Fix `Return` node for empty return statements.

### 0.4.4 (2020-09-02)

- Fixed `body` property of `ForStatement`: was `Block`, can also be `Statement`.
- Added support for Solidity 0.7.1.
  - Made nullable properties optional. For TypeScript this means that `null` values can now be `undefined`.
  - Added support for free functions: `FunctionDefinition` is now a potential child in `SourceUnit.nodes`.

### 0.4.3 (2020-07-02)

- Fixed `body` property of `WhileStatement`: was `Block`, can also be `Statement`.

### 0.4.2 (2020-07-02)

- Fixed `length` property of `ArrayTypeName`: was `null`, can be any `Expression`.

### 0.4.1 (2020-06-18)

- Added all EVM versions to `InlineAssembly` node.
- Fixed `findAll` to check for null property values.

### 0.4.0 (2020-06-12)

- Added `solidity-ast/utils` with the following utility functions:
  - `isNodeType(nodeType, node)`: a type predicate for type-safe filtering or
    any kind of narrowing.
  - `findAll(nodeType, node)`: a generator function that recursively enumerates
    all of a node's descendents of type `nodeType`.
  - Both of these functions can be partially applied by supplying only the
    `nodeType` argument. This is useful for higher order functions like
    `filter` or `map`, as in `nodes.filter(isNodeType('ContractDefinition'))`.
- Removed `solidity-ast/predicates`. Use `isNodeType` from `solidity-ast/utils` instead.

### 0.3.2 (2020-06-12)

- Fix type for `ImportDirective.symbolAliases`.

### 0.3.1 (2020-06-09)

- Added missing type for `ImportDirective.symbolAliases`.

### 0.3.0 (2020-06-04)

- Added `solidity-ast/predicates` with type guards for type-safe filtering.

```typescript
import { isContractDefinition } from 'solidity-ast/predicates';
const contractDefs = sourceUnit.nodes.filter(isContractDefinition);
// : ContractDefinition[]
```

- Removed `ParameterTypes`, which was a duplicate of `ParameterList`. The latter should be used instead.
- Removed `ParameterTypeName`, which wasn't referenced anywhere.

### 0.2.1 (2020-06-01)

- Add missing `>>` operator.

### 0.2.0 (2020-05-18)

- Complete schema to successfully validate OpenZeppelin Contracts.

### 0.1.0 (2020-05-15)

- Initial release with incomplete schema.
