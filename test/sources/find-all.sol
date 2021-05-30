// SPDX-License-Identifier: MIT

pragma solidity *;

struct S1 {
    uint x;
}

contract C1 {
    struct S2 {
        uint x;
    }

    function foo() external {
        assembly {
            let x := 0
        }
    }
}
