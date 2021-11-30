// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "../contracts/Ticketing.sol";

/// TODO: Use https://github.com/gnosis/mock-contract instead?
contract MockedTicketing is Ticketing {
  function getPriceInWei(uint) public view override returns (uint) {
    return 100;
  }
}
