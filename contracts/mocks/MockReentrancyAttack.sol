// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IValuationContract.sol";

contract MockReentrancyAttack is Ownable {
    IValuationContract public valuationContract;
    uint256 public attackCount;
    
    constructor(address _valuationContract) {
        valuationContract = IValuationContract(_valuationContract);
    }
    
    // Attack function that attempts reentrancy on valuation requests
    function attackValuationRequest(bytes32 assetId) external {
        attackCount = 0;
        valuationContract.requestValuation(assetId);
    }
    
    // Attack function that attempts reentrancy on data submissions
    function attackDataSubmission(bytes32 assetId, uint256 price) external {
        attackCount = 0;
        valuationContract.submitValuation(assetId, price);
    }
    
    // Fallback function that attempts to reenter
    receive() external payable {
        if (attackCount < 5) {
            attackCount++;
            // Try to reenter the contract
            valuationContract.requestValuation(bytes32(0));
        }
    }
    
    // Function to receive callbacks from the valuation contract
    function onValuationComplete(bytes32 assetId, uint256 value) external {
        if (attackCount < 5) {
            attackCount++;
            // Try to reenter the contract
            valuationContract.requestValuation(assetId);
        }
    }
} 