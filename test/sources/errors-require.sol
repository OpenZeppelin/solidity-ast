// SPDX-License-Identifier: MIT

pragma solidity >=0.8.26;

/// @dev docs
error InsufficientBalance(uint available, uint required);

contract Foo {
    error OhNo();

    function bar(uint x) external {
        require(x == 0, InsufficientBalance({ available: 0, required: 0 }));
    }
}
