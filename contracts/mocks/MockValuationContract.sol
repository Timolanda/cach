// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IValuationContract.sol";

contract MockValuationContract is IValuationContract {
    mapping(bytes32 => uint256) public valuations;
    mapping(bytes32 => uint256) public timestamps;
    mapping(bytes32 => uint8) public confidences;
    bool private _shouldRevert;

    event DataPointReceived(
        bytes32 indexed assetId,
        uint256 price,
        uint256 timestamp,
        uint8 confidence
    );

    function setShouldRevert(bool shouldRevert) external {
        _shouldRevert = shouldRevert;
    }

    function requestValuation(bytes32 assetId) external override {
        require(!_shouldRevert, "Simulated error");
        emit ValuationRequested(assetId, msg.sender);
    }

    function submitValuation(bytes32 assetId, uint256 value) external override {
        require(!_shouldRevert, "Simulated error");
        valuations[assetId] = value;
        timestamps[assetId] = block.timestamp;
        confidences[assetId] = 100;
        emit ValuationSubmitted(assetId, value, 100);
    }

    function submitDataPoint(
        bytes32 assetId,
        uint256 price,
        uint256 timestamp,
        uint8 confidence
    ) external override {
        require(!_shouldRevert, "Simulated error");
        valuations[assetId] = price;
        timestamps[assetId] = timestamp;
        confidences[assetId] = confidence;
        
        emit DataPointSubmitted(assetId, price, timestamp);
        emit DataPointReceived(assetId, price, timestamp, confidence);
    }

    function getValuation(bytes32 assetId) external view override returns (
        uint256 value,
        uint256 timestamp,
        uint8 confidence,
        bool isValid
    ) {
        require(!_shouldRevert, "Simulated error");
        return (
            valuations[assetId],
            timestamps[assetId],
            confidences[assetId],
            valuations[assetId] > 0
        );
    }
} 