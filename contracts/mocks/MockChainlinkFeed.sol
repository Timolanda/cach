// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract MockChainlinkFeed is AggregatorV3Interface {
    uint8 private constant _decimals = 8;
    string private constant _description = "Mock Price Feed";
    uint256 private constant _version = 1;

    int256 private _price;
    uint80 private _roundId;
    uint256 private _startedAt;
    uint256 private _updatedAt;
    uint80 private _answeredInRound;
    bool private _simulateError;

    function setLatestRoundData(
        uint80 roundId,
        int256 price,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) external {
        _roundId = roundId;
        _price = price;
        _startedAt = startedAt;
        _updatedAt = updatedAt;
        _answeredInRound = answeredInRound;
    }

    function setSimulateError(bool shouldError) external {
        _simulateError = shouldError;
    }

    function decimals() external pure override returns (uint8) {
        return _decimals;
    }

    function description() external pure override returns (string memory) {
        return _description;
    }

    function version() external pure override returns (uint256) {
        return _version;
    }

    function getRoundData(uint80 _roundId) external view override returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        require(!_simulateError, "Simulated error");
        return (_roundId, _price, _startedAt, _updatedAt, _answeredInRound);
    }

    function latestRoundData() external view override returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        require(!_simulateError, "Simulated error");
        return (_roundId, _price, _startedAt, _updatedAt, _answeredInRound);
    }
} 