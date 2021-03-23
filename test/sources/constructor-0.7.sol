// SPDX-License-Identifier: MIT

// PragmaDirective
pragma solidity >=0.7.0;

// InheritanceSpecifier
contract X {}
contract Y is X {
  constructor(uint) {}
}
contract Z is X, Y(3) {}

contract A {}
contract B is A {
  constructor(uint) {}
}
contract C is A, B {
  constructor(uint) A() B(3) {
  }
}
