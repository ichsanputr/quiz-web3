// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract QuizToken is ERC20 {
    // Constructor to set the initial supply and token name/symbol
    constructor(uint256 initialSupply) ERC20("QuizToken", "QT") {
        _mint(msg.sender, initialSupply);
    }
}