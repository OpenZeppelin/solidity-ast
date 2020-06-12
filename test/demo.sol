// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import { Import } from 'import.sol';
import { Import as Renamed } from 'import.sol';

contract Foo {
  uint x = 2 >> 1;
}
