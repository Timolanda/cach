// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "./interfaces/IDataProvider.sol";

contract OracleContract is 
    IDataProvider, 
    ReentrancyGuardUpgradeable, 
    OwnableUpgradeable,
    PausableUpgradeable 
{
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;

    struct OracleParameters {
        uint256 minSubmissionInterval;
        uint256 maxPriceDeviation;
        uint256 dataPointExpiry;
        uint256 maxHistoryLength;
    }

    // State variables
    mapping(bytes32 => DataPoint[]) private assetDataPoints;
    mapping(bytes32 => mapping(address => uint256)) private lastProviderUpdate;
    EnumerableSetUpgradeable.AddressSet private providers;
    
    OracleParameters public parameters;

    // Events
    event ProviderAdded(address indexed provider);
    event ProviderRemoved(address indexed provider);
    event DataPointRejected(
        bytes32 indexed assetId,
        address indexed provider,
        string reason
    );

    // Modifiers
    modifier onlyProvider() {
        require(providers.contains(msg.sender), "Not authorized provider");
        _;
    }

    modifier validSubmissionInterval(bytes32 assetId) {
        require(
            block.timestamp >= lastProviderUpdate[assetId][msg.sender] + parameters.minSubmissionInterval,
            "Submission too frequent"
        );
        _;
    }

    // Initialization
    function initialize(OracleParameters memory _parameters) public initializer {
        __ReentrancyGuard_init();
        __Ownable_init();
        __Pausable_init();

        parameters = _parameters;
    }

    // Core functions
    function submitDataPoint(
        bytes32 assetId,
        uint256 price,
        uint256 timestamp,
        uint8 confidence
    ) 
        external 
        override 
        onlyProvider 
        validSubmissionInterval(assetId)
        nonReentrant 
        whenNotPaused 
    {
        require(price > 0, "Invalid price");
        require(timestamp <= block.timestamp, "Invalid timestamp");
        require(confidence <= 100, "Invalid confidence");

        // Check price deviation
        if (assetDataPoints[assetId].length > 0) {
            uint256 lastPrice = assetDataPoints[assetId][assetDataPoints[assetId].length - 1].price;
            uint256 deviation = _calculateDeviation(price, lastPrice);
            require(deviation <= parameters.maxPriceDeviation, "Price deviation too high");
        }

        // Add new data point
        DataPoint memory newPoint = DataPoint({
            price: price,
            timestamp: timestamp,
            confidence: confidence,
            isValid: true
        });

        assetDataPoints[assetId].push(newPoint);
        lastProviderUpdate[assetId][msg.sender] = block.timestamp;

        // Trim history if needed
        if (assetDataPoints[assetId].length > parameters.maxHistoryLength) {
            _trimHistory(assetId);
        }

        emit DataPointSubmitted(
            assetId,
            msg.sender,
            price,
            timestamp,
            confidence
        );
    }

    // View functions
    function getLatestDataPoint(bytes32 assetId) 
        external 
        view 
        override 
        returns (DataPoint memory) 
    {
        require(assetDataPoints[assetId].length > 0, "No data points");
        return assetDataPoints[assetId][assetDataPoints[assetId].length - 1];
    }

    function getHistoricalData(bytes32 assetId, uint256 count) 
        external 
        view 
        override 
        returns (DataPoint[] memory) 
    {
        uint256 available = assetDataPoints[assetId].length;
        uint256 resultCount = count > available ? available : count;
        DataPoint[] memory result = new DataPoint[](resultCount);

        for (uint256 i = 0; i < resultCount; i++) {
            result[i] = assetDataPoints[assetId][available - resultCount + i];
        }

        return result;
    }

    // Internal functions
    function _calculateDeviation(uint256 newPrice, uint256 oldPrice) 
        internal 
        pure 
        returns (uint256) 
    {
        if (newPrice > oldPrice) {
            return ((newPrice - oldPrice) * 100) / oldPrice;
        }
        return ((oldPrice - newPrice) * 100) / oldPrice;
    }

    function _trimHistory(bytes32 assetId) internal {
        uint256 length = assetDataPoints[assetId].length;
        uint256 excessPoints = length - parameters.maxHistoryLength;
        
        // Shift array to remove oldest points
        for (uint256 i = 0; i < length - excessPoints; i++) {
            assetDataPoints[assetId][i] = assetDataPoints[assetId][i + excessPoints];
        }
        
        // Adjust array length
        for (uint256 i = 0; i < excessPoints; i++) {
            assetDataPoints[assetId].pop();
        }
    }

    // Admin functions
    function addProvider(address provider) external onlyOwner {
        require(provider != address(0), "Invalid provider address");
        require(providers.add(provider), "Provider already exists");
        emit ProviderAdded(provider);
    }

    function removeProvider(address provider) external onlyOwner {
        require(providers.remove(provider), "Provider does not exist");
        emit ProviderRemoved(provider);
    }

    function updateParameters(OracleParameters memory _parameters) external onlyOwner {
        parameters = _parameters;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Emergency functions
    function clearDataPoints(bytes32 assetId) external onlyOwner {
        delete assetDataPoints[assetId];
    }
} 