# Changelog

### 0.4.39 (2022-12-16)
- Optimize `findAll` for multiple wanted node types.

### 0.4.38 (2022-11-15)
- Add missing types for `srcDecoder`.

### 0.4.37 (2022-11-15)
- Add `srcDecoder`, a new util to decode source locations in AST nodes.

### 0.4.36 (2022-11-14)
- Fix error in `findAll` when the code contains user defined value types.

### 0.4.35 (2022-06-23)
- Make `IndexAccess.indexExpression` nullable, which shows up when array types are used with `abi.decode`.

### 0.4.34 (2022-06-11)
- Add missing files to package.

### 0.4.33 (2022-06-11)
- Removed circular dependency from utils.

### 0.4.32 (2022-04-24)
- Added `EventDefinition.eventSelector` and `ErrorDefinition.errorSelector`.
- Added `InlineAssembly.flags` which can now indicate assembly as memory safe.
- Added `UsingForDirective.global`.
- In `UsingForDirective` added `functionList` and made `libraryName` optional. These properties are exclusive: exactly one of them should be present, though this is not encoded in the type.
- Fixed `UsingForDirective.typeName`: it should have always been nullable to account for `using ... for *`.

### 0.4.31 (2022-03-20)
- Add `SolcInput` interface.

### 0.4.30 (2022-01-27)
- Support an array of node types in `isNodeType`.

### 0.4.29 (2021-12-24)

- Made input array types `readonly` in `utils` module.

### 0.4.28 (2021-10-27)

- Added `DoWhileStatement`, `Continue`, and `Break`. All of them kinds of `Statement`.

### 0.4.27 (2021-06-25)

- Added `UserDefinedValueTypeDefinition` which can appear in `SourceUnit` and `ContractDefinition`.
- Added `ContractDefinition.canonicalName` from Solidity 0.8.9.
- Added new EVM version `'london'`.

### 0.4.26 (2021-06-25)

- Add a new utility for looking up AST nodes based on their id and type.

### 0.4.25 (2021-06-01)

- Remove Yul nodes from `Node` and `NodeType`, export them separately as `YulNode` and `YulNodeType`.

### 0.4.24 (2021-06-01)

- Fixed duplicate type name in generated declaration file.

### 0.4.23 (2021-05-30)

- Added missing values for `Assignment.operator`: `>>=`, `<<=`
- Added missing values for `BinaryOperation.operator`: `&`, `|`
- Added missing kind of `Expression`: `IndexRangeAccess` (e.g. `msg.data[start:end]`)
- Added missing field in members of `InlineAssembly.externalReferences`: `suffix` (`'slot'` and `'offset'`)

### 0.4.22 (2021-05-30)

- Added Yul types for typing `InlineAssembly.AST`.
- Fixed `Identifier.overloadedDeclarations`: was `unknown` and is now `number`.

### 0.4.21 (2021-05-23)

- Rewrote schema in JavaScript in a more modular way.
- Fixed `IndexAccess.baseExpression`: was optional but is required.
- Added missing values for `Assignment.operator`: `-=`, `*=`, `%=`, `|=`, `&=`, `^=`.
- Added statement-level `documentation` available since Solidity 0.8.2.

### 0.4.20 (2021-04-22)

- Added new Solidity 0.8.4 constructs:
  - `ErrorDefinition` as a new child of `SourceUnit` and `ContractDefinition`
  - `RevertStatement` as a new kind of statement
  - `ContractDefinition.usedErrors`

### 0.4.19 (2021-03-23)

- Added new Solidity 0.8.3 field `ModifierInvocation.kind`.

Note that there is a bug in 0.8.3 where `kind` never actually has the value
`"baseConstructorSpecifier"`. This will presumably be fixed in the next
release.

### 0.4.18 (2021-03-21)

- Added new Solidity 0.8.2 field `nameLocation` in:
  - `EnumValue`
  - `EnumDefinition`
  - `EventDefinition`
  - `FunctionDefinition`
  - `ModifierDefinition`
  - `ImportDirective` (and entries of `ImportDirective.symbolAliases`)
  - `ContractDefinition`
  - `StructDefinition`
  - `VariableDeclaration`

### 0.4.17 (2021-01-05)

- Added missing override-related types and fields:
  - `ModifierDefinition.baseModifiers: number[]`
  - `ModifierDefinition.overrides?: OverrideSpecifier`
  - `VariableDeclaration.baseFunctions: number[]`
  - `VariableDeclaration.overrides?: OverrideSpecifier`

### 0.4.16 (2020-12-17)

- Added `Block` as a possible kind of `Statement`.
- Added new Solidity 0.8 constructs:
  - `UncheckedBlock` is a new kind of `Statement`.
  - `IdentifierPath` is a new node type that replaces some instances of `UserDefinedTypeName` and `Identifier`, used in the following places:
    - `InheritanceSpecifier.baseName`
    - `ModifierInvocation.modifierName`
    - `OverrideSpecifier.overrides`
    - `UsingForDirective.libraryName`
    - `UserDefinedTypeName.pathNode` (new)

### 0.4.15 (2020-12-11)

- Extended `findAll` to enumerate multiple node types simultaneously.

### 0.4.14 (2020-11-18)

- Added `hexString`, `unicodeString` as possible values for `Literal.kind`. Available since Solidity 0.7.0.

### 0.4.13 (2020-11-02)

- Fixed `findAll` crash when used with node type `'SourceUnit'`.

### 0.4.12 (2020-10-22)

- Added an optional argument `prune` to `findAll`.

> If the optional `prune: (node: Node) => boolean` argument is specified,
> `findAll` will apply the function to each node, if the return value is truthy
> the node will be ignored, neither yielding the node nor recursing into it. Note
> that `prune` is not available when curried.

### 0.4.11 (2020-10-19)

- Added support for file-level constant `VariableDeclaration` nodes, available since Solidity 0.7.4.

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
