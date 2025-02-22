// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IValuationContract.sol";

contract MockTimestampManipulation is Ownable {
    IValuationContract public valuationContract;
    
    constructor(address _valuationContract) {
        valuationContract = IValuationContract(_valuationContract);
    }
    
    // Attempt to manipulate timestamps in data submissions
    function attemptTimestampManipulation(
        bytes32 assetId,
        uint256 price,
        uint256 timestamp
    ) external {
        // Try to submit data with manipulated timestamp
        valuationContract.submitDataPoint(
            assetId,
            price,
            timestamp,
            85
        );
    }
    
    // Attempt to exploit block timestamp dependency
    function attemptBlockTimestampExploit(
        bytes32 assetId,
        uint256 price
    ) external {
        // Try to submit multiple data points with small timestamp differences
        for (uint i = 0; i < 5; i++) {
            valuationContract.submitDataPoint(
                assetId,
                price,
                block.timestamp + i,
                85
            );
        }
    }
    
    // Function to test future timestamp submissions
    function attemptFutureTimestamp(
        bytes32 assetId,
        uint256 price
    ) external {
        // Try to submit data with future timestamp
        valuationContract.submitDataPoint(
            assetId,
            price,
            block.timestamp + 1 days,
            85
        );
    }
} 