// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../DataProvider.sol";

contract ChainlinkProvider is DataProvider {
    // Mapping from asset ID to Chainlink feed address
    mapping(bytes32 => address) public priceFeeds;
    
    // Minimum number of decimals required for price feeds
    uint8 public constant MIN_DECIMALS = 8;
    
    // Provider information
    string public constant PROVIDER_NAME = "Chainlink";
    string public constant PROVIDER_VERSION = "1.0.0";

    // Events
    event PriceFeedUpdated(bytes32 indexed assetId, address indexed feed);
    event PriceFeedRemoved(bytes32 indexed assetId, address indexed feed);

    // Errors
    error InvalidPriceFeed();
    error StalePrice();
    error PriceFeedNotFound();

    function initialize(address _valuationContract) external initializer {
        __DataProvider_init(_valuationContract);
    }

    // Override updateDataSource to fetch latest prices from Chainlink
    function updateDataSource() external override {
        // This function can be called by automated systems to update all tracked assets
        bytes32[] memory trackedAssets = _getTrackedAssets();
        
        for (uint i = 0; i < trackedAssets.length; i++) {
            bytes32 assetId = trackedAssets[i];
            address feedAddress = priceFeeds[assetId];
            
            if (feedAddress != address(0)) {
                _updateAssetPrice(assetId, feedAddress);
            }
        }
    }

    // Add or update price feed for an asset
    function setPriceFeed(bytes32 assetId, address feed) external onlyOwner {
        if (feed == address(0)) revert InvalidPriceFeed();
        
        // Validate the price feed
        AggregatorV3Interface priceFeed = AggregatorV3Interface(feed);
        require(priceFeed.decimals() >= MIN_DECIMALS, "Insufficient decimals");

        // Test the feed
        try priceFeed.latestRoundData() returns (
            uint80 roundId,
            int256 price,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) {
            require(price >= 0, "Negative price");
            require(updatedAt > 0, "Round not complete");
            require(answeredInRound >= roundId, "Stale price");
        } catch {
            revert InvalidPriceFeed();
        }

        priceFeeds[assetId] = feed;
        emit PriceFeedUpdated(assetId, feed);
    }

    // Remove price feed for an asset
    function removePriceFeed(bytes32 assetId) external onlyOwner {
        address feed = priceFeeds[assetId];
        require(feed != address(0), "Feed not found");
        
        delete priceFeeds[assetId];
        emit PriceFeedRemoved(assetId, feed);
    }

    // Override provider info
    function getProviderInfo() external pure override returns (string memory name, string memory details) {
        return (PROVIDER_NAME, PROVIDER_VERSION);
    }

    // Internal function to update price for a single asset
    function _updateAssetPrice(bytes32 assetId, address feedAddress) internal {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(feedAddress);
        
        try priceFeed.latestRoundData() returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) {
            // Validate the response
            if (answer < 0) revert InvalidPriceFeed();
            if (updatedAt == 0) revert StalePrice();
            if (answeredInRound < roundId) revert StalePrice();

            // Calculate confidence based on price age
            uint8 confidence = _calculateConfidence(updatedAt);
            
            // Submit the price data
            this.submitDataPoint(
                assetId,
                uint256(answer),
                updatedAt,
                confidence
            );
        } catch {
            emit ValidationFailed(assetId, "Price feed error");
        }
    }

    // Calculate confidence based on data freshness
    function _calculateConfidence(uint256 updateTime) internal view returns (uint8) {
        uint256 age = block.timestamp - updateTime;
        
        // Confidence levels based on data age:
        // < 1 minute: 95-100%
        // 1-5 minutes: 80-94%
        // 5-15 minutes: 60-79%
        // 15-30 minutes: 40-59%
        // > 30 minutes: 0-39%
        
        if (age < 1 minutes) return 95;
        if (age < 5 minutes) return 80;
        if (age < 15 minutes) return 60;
        if (age < 30 minutes) return 40;
        return 20;
    }

    // Get list of tracked assets
    function _getTrackedAssets() internal view returns (bytes32[] memory) {
        // Implementation depends on how we want to track assets
        // This is a simplified version that would need to be implemented
        // based on specific requirements
        return new bytes32[](0);
    }

    // Override validation to add Chainlink-specific checks
    function _validateDataPoint(
        bytes32 assetId,
        uint256 price,
        uint256 timestamp,
        uint8 confidence
    ) internal override returns (bool) {
        // First perform base validation
        bool baseValid = super._validateDataPoint(assetId, price, timestamp, confidence);
        if (!baseValid) return false;

        // Additional Chainlink-specific validation
        if (priceFeeds[assetId] == address(0)) {
            emit ValidationFailed(assetId, "No price feed configured");
            return false;
        }

        // Validate price staleness
        if (block.timestamp - timestamp > 1 hours) {
            emit ValidationFailed(assetId, "Price too old");
            return false;
        }

        return true;
    }
} 