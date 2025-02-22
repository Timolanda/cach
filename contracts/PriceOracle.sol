// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceOracle is Ownable {
    struct AssetPrice {
        uint256 price;
        uint256 timestamp;
        address validator;
    }

    mapping(string => AssetPrice) public assetPrices;
    mapping(address => bool) public validators;
    uint256 public constant PRICE_VALIDITY_PERIOD = 1 days;

    event PriceUpdated(string indexed assetId, uint256 price, address validator);
    event ValidatorUpdated(address validator, bool status);

    modifier onlyValidator() {
        require(validators[msg.sender], "Not a validator");
        _;
    }

    function updatePrice(string memory _assetId, uint256 _price) external onlyValidator {
        assetPrices[_assetId] = AssetPrice({
            price: _price,
            timestamp: block.timestamp,
            validator: msg.sender
        });
        
        emit PriceUpdated(_assetId, _price, msg.sender);
    }

    function setValidator(address _validator, bool _status) external onlyOwner {
        validators[_validator] = _status;
        emit ValidatorUpdated(_validator, _status);
    }

    function getPrice(string memory _assetId) external view returns (uint256, bool) {
        AssetPrice memory price = assetPrices[_assetId];
        bool valid = block.timestamp - price.timestamp <= PRICE_VALIDITY_PERIOD;
        return (price.price, valid);
    }

    function batchUpdatePrices(
        string[] memory _assetIds,
        uint256[] memory _prices
    ) external onlyValidator {
        require(_assetIds.length == _prices.length, "Length mismatch");
        
        for (uint i = 0; i < _assetIds.length; i++) {
            assetPrices[_assetIds[i]] = AssetPrice({
                price: _prices[i],
                timestamp: block.timestamp,
                validator: msg.sender
            });
            
            emit PriceUpdated(_assetIds[i], _prices[i], msg.sender);
        }
    }
} 