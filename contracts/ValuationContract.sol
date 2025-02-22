// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./interfaces/IValuationContract.sol";
import "./interfaces/IDataProvider.sol";

contract ValuationContract is 
    IValuationContract, 
    ReentrancyGuardUpgradeable, 
    OwnableUpgradeable,
    PausableUpgradeable 
{
    struct ValuationParameters {
        uint256 minDataPoints;
        uint8 confidenceThreshold;
        uint256 maxValidityPeriod;
        uint256 updateDelay;
    }

    struct Valuation {
        uint256 value;
        uint256 timestamp;
        uint8 confidence;
        bool isValid;
    }

    // State variables
    mapping(bytes32 => Valuation) private valuations;
    mapping(bytes32 => uint256) private lastUpdateTime;
    mapping(address => bool) private authorizedProviders;
    
    ValuationParameters public parameters;
    IDataProvider public dataProvider;

    // Modifiers
    modifier onlyAuthorizedProvider() {
        require(authorizedProviders[msg.sender], "Unauthorized provider");
        _;
    }

    modifier validDataPoint(uint256 price, uint256 timestamp, uint8 confidence) {
        require(price > 0, "Invalid price value");
        require(timestamp <= block.timestamp, "Invalid timestamp");
        require(confidence <= 100, "Invalid confidence value");
        _;
    }

    // Initialization
    function initialize(
        address _dataProvider,
        ValuationParameters memory _parameters
    ) public initializer {
        __ReentrancyGuard_init();
        __Ownable_init();
        __Pausable_init();

        dataProvider = IDataProvider(_dataProvider);
        parameters = _parameters;
    }

    // Core functions
    function requestValuation(bytes32 assetId) external override nonReentrant whenNotPaused {
        require(
            block.timestamp >= lastUpdateTime[assetId] + parameters.updateDelay,
            "Update delay not elapsed"
        );

        emit ValuationRequested(assetId, msg.sender);
        _processValuation(assetId);
    }

    function submitValuation(bytes32 assetId, uint256 value) 
        external 
        override 
        onlyAuthorizedProvider 
        nonReentrant 
        whenNotPaused 
    {
        _updateValuation(assetId, value, 100); // Provider submissions have max confidence
        emit ValuationSubmitted(assetId, value, 100);
    }

    function submitDataPoint(
        bytes32 assetId,
        uint256 price,
        uint256 timestamp,
        uint8 confidence
    ) 
        external 
        override 
        onlyAuthorizedProvider 
        validDataPoint(price, timestamp, confidence) 
        nonReentrant 
        whenNotPaused 
    {
        emit DataPointSubmitted(assetId, price, timestamp);
        _processDataPoint(assetId, price, timestamp, confidence);
    }

    // View functions
    function getValuation(bytes32 assetId) 
        external 
        view 
        override 
        returns (
            uint256 value,
            uint256 timestamp,
            uint8 confidence,
            bool isValid
        ) 
    {
        Valuation memory val = valuations[assetId];
        return (val.value, val.timestamp, val.confidence, val.isValid);
    }

    // Internal functions
    function _processValuation(bytes32 assetId) internal {
        IDataProvider.DataPoint[] memory dataPoints = dataProvider.getHistoricalData(
            assetId,
            parameters.minDataPoints
        );

        require(dataPoints.length >= parameters.minDataPoints, "Insufficient data points");

        (uint256 value, uint8 confidence) = _calculateValuation(dataPoints);
        require(confidence >= parameters.confidenceThreshold, "Confidence too low");

        _updateValuation(assetId, value, confidence);
        emit ValuationCompleted(assetId, value, confidence);
    }

    function _calculateValuation(IDataProvider.DataPoint[] memory dataPoints)
        internal
        pure
        returns (uint256 value, uint8 confidence)
    {
        // Implement valuation logic (e.g., TWAP, VWAP, or more complex calculations)
        // This is a simplified example using weighted average
        uint256 totalWeight = 0;
        uint256 weightedSum = 0;

        for (uint i = 0; i < dataPoints.length; i++) {
            uint256 weight = dataPoints[i].confidence;
            weightedSum += dataPoints[i].price * weight;
            totalWeight += weight;
        }

        value = weightedSum / totalWeight;
        confidence = uint8((totalWeight / dataPoints.length));
        
        return (value, confidence);
    }

    function _updateValuation(bytes32 assetId, uint256 value, uint8 confidence) internal {
        valuations[assetId] = Valuation({
            value: value,
            timestamp: block.timestamp,
            confidence: confidence,
            isValid: true
        });
        lastUpdateTime[assetId] = block.timestamp;
    }

    // Admin functions
    function addProvider(address provider) external onlyOwner {
        authorizedProviders[provider] = true;
    }

    function removeProvider(address provider) external onlyOwner {
        authorizedProviders[provider] = false;
    }

    function updateParameters(ValuationParameters memory _parameters) external onlyOwner {
        parameters = _parameters;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
} 