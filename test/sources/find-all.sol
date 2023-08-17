// SPDX-License-Identifier: MIT

pragma solidity *;

import {Import} from "./import.sol";

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
