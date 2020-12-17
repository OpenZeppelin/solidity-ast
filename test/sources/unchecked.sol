// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

contract Foo {
    function foo() external returns (uint256 x) {
        unchecked {
            x += 1;
        }
    }
}
