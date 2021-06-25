// SPDX-License-Identifier: MIT

pragma solidity *;

contract C1 {
    function foo() external {
    }
}

contract C2 is C1 {}
contract C3 is C1, C2 {}
