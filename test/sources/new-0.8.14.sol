pragma solidity >=0.8.14;

contract C {
    event E();

    bytes32 sel = E.selector;
}
