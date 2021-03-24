// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2;

/// @custom:natspec for contract-definition
contract C {
    /// @custom:natspec for struct-definition
    struct S {
        // no natspec support here
        uint256 v;
    }

    /// @custom:natspec for enum-definition
    enum E {
        /// @custom:natspec for enum-entry-definition
        Value
    }

    /// @custom:natspec for modifier-definition
    modifier DoesNothingModifier() {
        /// @custom:natspec for placeholder-statement
        _;
    }

    /// @custom:natspec for storage-definition
    uint256 public x = 0;

    /// @custom:natspec for event-definition
    event Incremented();

    /// @custom:natspec for external function-definition
    function incr() external DoesNothingModifier() returns (uint256) {
        /// @custom:natspec for function-call
        _beforeIncr();
        // no natspec support here
        uint256 v;
        /// @custom:natspec for variable-set
        v = ++x;
        /// @custom:natspec for event
        emit Incremented();
        /// @custom:natspec for variable-assignement
        return v;
    }

    /// @custom:natspec for internal function-definition
    function _beforeIncr() internal virtual {}
}
