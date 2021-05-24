// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

contract C {
    error E();
    function foo() public {
        /// abc
        revert E();
        /// abc
        uint x = 3;
    }
}
