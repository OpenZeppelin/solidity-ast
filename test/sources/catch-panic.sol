// SPDX-License-Identifier: MIT

pragma solidity >=0.8.1;

contract CatchPanic {
    function foo() public {
        try this.foo() {
        } catch Panic (uint code) {
        }
    }
}
