// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

/// @dev docs
error InsufficientBalance(uint available, uint required);

contract Foo {
    error OhNo();

    function bar(uint x) external {
        if (x > 0) {
            revert InsufficientBalance({
                available: 0,
                required: 0
            });
        } else {
            revert OhNo();
        }
    }
}
