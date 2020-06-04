# Changelog

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
