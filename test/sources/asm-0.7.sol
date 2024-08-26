pragma solidity >=0.7;

contract Asm {
    uint s;

    function foo(bytes calldata b) external {
        assembly {
            let x := s.slot
            let y := s.offset

            function fail() {
                revert(0, 0)
            }
        }
    }
}
