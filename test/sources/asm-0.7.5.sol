pragma solidity >=0.7.5;

contract Asm {
    function foo(bytes calldata b) external {
        assembly {
            let z := b.length
        }
    }
}
