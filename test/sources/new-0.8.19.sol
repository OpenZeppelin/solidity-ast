pragma solidity >=0.8.19;

type Int is int;

using {add as +, negate as -} for Int global;

function add(Int a, Int b) pure returns (Int) {
    return Int.wrap(Int.unwrap(a) + Int.unwrap(b));
}

function negate(Int a) pure returns (Int) {
    return Int.wrap(-Int.unwrap(a));
}

function test(Int a, Int b) pure returns (Int) {
    return a + (-b);
}
