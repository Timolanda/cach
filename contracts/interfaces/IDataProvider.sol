// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDataProvider {
    struct DataPoint {
        uint256 price;
        uint256 timestamp;
        uint8 confidence;
        bool isValid;
    }

    /**
     * @dev Submit a new data point for an asset
     * @param assetId The unique identifier of the asset
     * @param price The price of the asset
     * @param timestamp The timestamp of the observation
     * @param confidence The confidence level (0-100)
     */
    function submitDataPoint(
        bytes32 assetId,
        uint256 price,
        uint256 timestamp,
        uint8 confidence
    ) external;

    /**
     * @dev Get the latest data point for an asset
     * @param assetId The unique identifier of the asset
     */
    function getLatestDataPoint(bytes32 assetId) external view returns (DataPoint memory);

    /**
     * @dev Get the historical data points for an asset
     * @param assetId The unique identifier of the asset
     * @param count The number of historical points to retrieve
     */
    function getHistoricalData(bytes32 assetId, uint256 count) 
        external 
        view 
        returns (DataPoint[] memory);

    // Events
    event DataPointSubmitted(
        bytes32 indexed assetId,
        address indexed provider,
        uint256 price,
        uint256 timestamp,
        uint8 confidence
    );
} 