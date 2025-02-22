// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./AssetToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetTokenFactory is Ownable {
    event TokenCreated(address tokenAddress, string assetId);
    
    mapping(string => address) public assetTokens;
    
    function createToken(
        string memory _name,
        string memory _symbol,
        string memory _assetId,
        string memory _assetType,
        uint256 _valuation,
        uint256 _totalShares
    ) external onlyOwner returns (address) {
        require(assetTokens[_assetId] == address(0), "Asset already tokenized");
        
        AssetToken token = new AssetToken(
            _name,
            _symbol,
            _assetId,
            _assetType,
            _valuation,
            _totalShares
        );
        
        assetTokens[_assetId] = address(token);
        token.transferOwnership(msg.sender);
        
        emit TokenCreated(address(token), _assetId);
        return address(token);
    }
} 