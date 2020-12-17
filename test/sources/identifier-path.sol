// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import * as M1 from './basic.sol';

contract C is M1.Abs {
    function abs1() override(M1.Abs) public {
    }
}

import * as M2 from './constructor-0.7.sol';

contract W1 is M2.Y {
    constructor() M2.Y(4) {}
}

contract W2 is M2.Y(4) {
    constructor() {}
}
