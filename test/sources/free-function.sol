// SPDX-License-Identifier: MIT

// PragmaDirective
pragma solidity >=0.7.1;

function min(uint8 x, uint8 y) pure returns (uint) {
    return x < y ? x : y;
}

function min(uint x, uint y) pure returns (uint) {
    return x < y ? x : y;
}

function sum(uint[] storage items) view returns (uint s) {
    for (uint i = 0; i < items.length; i++)
        s += items[i];
}

function bar(uint x, uint y) {
    // Identifier.overloadedDeclarations
    min(x, y);
}
