// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2;

contract C {
    event E();

    modifier DoesNothingModifier() {
        /// abc
        _;
    }

    function incr() external DoesNothingModifier() {
        /// abc
        {}
        /// abc
        emit E();
        /// abc
        _beforeIncr();
        /// abc
        for (;;) {}
        /// abc
        if (true) {}
        /// abc
        assembly {}
        /// abc
        try this.incr() {} catch {}
        /// abc
        unchecked {}
        /// abc
        while (true) {}
        /// abc
        return;
    }

    function _beforeIncr() internal virtual {}
}
