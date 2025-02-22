// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./interfaces/IDataProvider.sol";
import "./interfaces/IValuationContract.sol";

abstract contract DataProvider is 
    IDataProvider, 
    ReentrancyGuardUpgradeable, 
    OwnableUpgradeable,
    PausableUpgradeable 
{
    // State variables
    IValuationContract public valuationContract;
    mapping(bytes32 => DataPoint) private latestDataPoints;
    mapping(bytes32 => DataPoint[]) private dataHistory;
    uint256 public constant MAX_HISTORY_LENGTH = 100;
    uint256 public constant MIN_UPDATE_INTERVAL = 5 minutes;

    // Events
    event DataSourceUpdated(string indexed source, string details);
    event ValidationFailed(bytes32 indexed assetId, string reason);
    event DataPointProcessed(bytes32 indexed assetId, uint256 price, uint8 confidence);

    // Modifiers
    modifier validUpdateInterval(bytes32 assetId) {
        require(
            block.timestamp >= latestDataPoints[assetId].timestamp + MIN_UPDATE_INTERVAL,
            "Update too frequent"
        );
        _;
    }

    // Initialization
    function __DataProvider_init(address _valuationContract) internal initializer {
        __ReentrancyGuard_init();
        __Ownable_init();
        __Pausable_init();

        require(_valuationContract != address(0), "Invalid valuation contract");
        valuationContract = IValuationContract(_valuationContract);
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
        onlyOwner 
        validUpdateInterval(assetId)
        nonReentrant 
        whenNotPaused 
    {
        require(_validateDataPoint(assetId, price, timestamp, confidence), "Validation failed");

        DataPoint memory newPoint = DataPoint({
            price: price,
            timestamp: timestamp,
            confidence: confidence,
            isValid: true
        });

        // Update latest data point
        latestDataPoints[assetId] = newPoint;

        // Update history
        if (dataHistory[assetId].length >= MAX_HISTORY_LENGTH) {
            _shiftHistory(assetId);
        }
        dataHistory[assetId].push(newPoint);

        // Submit to valuation contract
        valuationContract.submitDataPoint(assetId, price, timestamp, confidence);

        emit DataPointSubmitted(assetId, msg.sender, price, timestamp, confidence);
        emit DataPointProcessed(assetId, price, confidence);
    }

    // View functions
    function getLatestDataPoint(bytes32 assetId) 
        external 
        view 
        override 
        returns (DataPoint memory) 
    {
        require(latestDataPoints[assetId].isValid, "No valid data point");
        return latestDataPoints[assetId];
    }

    function getHistoricalData(bytes32 assetId, uint256 count) 
        external 
        view 
        override 
        returns (DataPoint[] memory) 
    {
        uint256 available = dataHistory[assetId].length;
        uint256 resultCount = count > available ? available : count;
        DataPoint[] memory result = new DataPoint[](resultCount);

        for (uint256 i = 0; i < resultCount; i++) {
            result[i] = dataHistory[assetId][available - resultCount + i];
        }

        return result;
    }

    // Internal functions
    function _shiftHistory(bytes32 assetId) internal {
        uint256 length = dataHistory[assetId].length;
        for (uint256 i = 0; i < length - 1; i++) {
            dataHistory[assetId][i] = dataHistory[assetId][i + 1];
        }
        dataHistory[assetId].pop();
    }

    function _validateDataPoint(
        bytes32 assetId,
        uint256 price,
        uint256 timestamp,
        uint8 confidence
    ) internal virtual returns (bool) {
        if (price == 0) {
            emit ValidationFailed(assetId, "Zero price");
            return false;
        }

        if (timestamp > block.timestamp) {
            emit ValidationFailed(assetId, "Future timestamp");
            return false;
        }

        if (confidence > 100) {
            emit ValidationFailed(assetId, "Invalid confidence");
            return false;
        }

        if (latestDataPoints[assetId].isValid) {
            uint256 lastPrice = latestDataPoints[assetId].price;
            uint256 deviation = _calculateDeviation(price, lastPrice);
            if (deviation > 50) { // 50% max deviation
                emit ValidationFailed(assetId, "Price deviation too high");
                return false;
            }
        }

        return true;
    }

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

    // Admin functions
    function updateValuationContract(address _valuationContract) external onlyOwner {
        require(_valuationContract != address(0), "Invalid valuation contract");
        valuationContract = IValuationContract(_valuationContract);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // To be implemented by specific providers
    function updateDataSource() external virtual;
    function getProviderInfo() external virtual view returns (string memory name, string memory details);
} 