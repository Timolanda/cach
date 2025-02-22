// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILendingPool {
    /**
     * @dev Function to execute a flash loan
     * @param receiver The address of the contract receiving the funds
     * @param token The loan currency
     * @param amount The amount of tokens to loan
     * @param params Variadic packed params to pass to the receiver
     */
    function flashLoan(
        address receiver,
        address token,
        uint256 amount,
        bytes calldata params
    ) external;

    /**
     * @dev Returns the fee to be charged for a flash loan
     * @param amount The amount of tokens to be borrowed
     */
    function flashLoanFee(uint256 amount) external view returns (uint256);

    // Events
    event FlashLoan(
        address indexed receiver,
        address indexed token,
        uint256 amount,
        uint256 fee
    );
} 