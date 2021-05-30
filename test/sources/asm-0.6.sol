pragma solidity ^0.6;

contract Asm {
    uint s;

    function foo() external {
        assembly {
            let x := s_slot
            let y := s_offset
        }
    }
}
