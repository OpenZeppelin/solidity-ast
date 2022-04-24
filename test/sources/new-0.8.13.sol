pragma solidity >=0.8.13;

library Lib {
}

using Lib for uint;
using Lib for uint global;

contract C {
    function foo() external {
        assembly ("memory-safe") {
        }

        /// @solidity memory-safe-assembly
        assembly {
        }
    }
}
