// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IValuationContract {
    // Core valuation functions
    function requestValuation(bytes32 assetId) external;
    function submitValuation(bytes32 assetId, uint256 value) external;
    function submitDataPoint(bytes32 assetId, uint256 price, uint256 timestamp, uint8 confidence) external;
    
    // View functions
    function getValuation(bytes32 assetId) external view returns (
        uint256 value,
        uint256 timestamp,
        uint8 confidence,
        bool isValid
    );
    
    // Events
    event ValuationRequested(bytes32 indexed assetId, address indexed requester);
    event ValuationSubmitted(bytes32 indexed assetId, uint256 value, uint8 confidence);
    event DataPointSubmitted(bytes32 indexed assetId, uint256 price, uint256 timestamp);
    event ValuationCompleted(bytes32 indexed assetId, uint256 value, uint8 confidence);
} 