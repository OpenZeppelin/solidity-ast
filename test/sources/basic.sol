// SPDX-License-Identifier: MIT

// PragmaDirective
pragma solidity *;

// ImportDirective
import { Import } from 'import.sol';

// ImportDirective.symbolAliases[].local
import { Import as Renamed } from 'import.sol';

// ImportDirective.unitAlias
import 'import.sol' as imp;

// ContractDefinition
contract Foo {

  // UsingForDirective
  using Lib for Struct;

  // EventDefinition
  event Ev(uint);

  // VariableDeclaration
  // BinaryOperation (.operator = >>)
  uint x1 = 2 >> 1;

  // ArrayTypeName (.length = Literal)
  uint[4] xs1;

  // ArrayTypeName (.length = Expression)
  uint[4+2] xs2;

  // FunctionTypeName
  function (uint, uint) internal returns (uint, uint) f;

  // Mapping
  mapping (uint => string) mp;

  // StructDefinition
  struct Struct { uint m1; uint m2; }

  // EnumDefinition
  enum Enum { E1, E2 }

  uint constant x2 = 4;
  uint immutable x3 = 4;

  // Literal (.kind = hexString)
  bytes public ff = hex"ff";

  // FunctionDefinition
  function foo1() public returns (uint) {

    // EmitStatement
    emit Ev(4);

    // VariableDeclarationStatement
    uint v = 4;
    uint u; u;

    // ExpressionStatement
    // Assignment
    // Conditional
    v = true ? 4 : 2;

    // ElementaryTypeNameExpression
    v = uint(4+2);

    // FunctionCall
    foo2();

    // FunctionCallOptions
    // MemberAccess
    this.foo4{ value: 1 }();

    // IndexAccess
    v = xs1[0];

    // NewExpression
    new X();

    // TupleExpression
    (int y, uint z) = (1, 3);
    y; z;

    // UnaryOperation
    y = -3;

    // ForStatement
    for (uint i = 0; i < 10; i++) {}
    for (uint i = 0; i < 10; i++) z = i;
    for (;;) {}
    for (y = 0; ; ) {}

    // IfStatement
    if (false) v; else v;
    if (false) {} else {}
    if (false) {}

    // WhileStatement
    while (true) v;

    Struct memory s1 = Struct(1, 2);
    Struct memory s2 = Struct({ m1: 1, m2: 2 });
    s1; s2;

    try this.foo1() { } catch Error(string memory) { } catch (bytes memory) { }

    {
        y = 5;
        y += 1;
        y -= 2;
        y *= 1;
        y /= 2;
        y %= 2;
        y |= 2;
        y &= 2;
        y ^= 2;
    }

    // Return
    return v;
  }

  // FunctionDefinition (.stateMutability = pure)
  function foo2() public pure {}

  // FunctionDefinition (.stateMutability = view, .visibility = internal)
  function foo3() internal view {}

  // FunctionDefinition (.stateMutability = payable, .visibility = external)
  function foo4() external payable {}

  // ModifierDefinition
  modifier mod(uint u) {
    _;
  }

  // ModifierInvocation
  function foo5() public pure mod(2) {}

  // .storageLocation = calldata
  function foo6(string calldata) external {}

  // .storageLocation = storage
  function foo7(string storage) internal {}
}

// InheritanceSpecifier
contract X {}
contract Y is X {}
contract Z is X, Y {}

// ContractDefinition (.abstract = true)
abstract contract Abs {

  // FunctionDefinition (.implemented = false, .virtual = true)
  function abs1() public virtual;

  function x() view external virtual returns (uint) { return 0; }

  modifier foo() virtual { _; }
}

contract Con is Abs {
  function abs1() public override(Abs) {}

  uint public override x;

  modifier foo() override(Abs) { _; }
}

// ContractDefinition (.contractKind = interface)
interface If {}

// ContractDefinition (.contractKind = interface)
library Lib {}

// StructDefinition (under SourceUnit)
struct S { uint m1; }

// EnumDefinition (under SourceUnit)
enum E { E1 }

// StructuredDocumentation
/// @dev doc
contract Doc {
  /// @dev fun
  uint x;
  /// @dev fun
  function fun() public pure {}
  /// @dev Ev
  event Ev();
  /// @dev mod
  modifier mod() { _; }
}

contract Asm {
  function fun() public pure {
    assembly {
    }
  }
}
