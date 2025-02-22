// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract AssetToken is ERC20, Ownable, Pausable, ERC20Permit {
    // Asset metadata
    string public assetId;
    string public assetType;
    uint256 public valuation;
    uint256 public totalShares;
    
    // Compliance
    mapping(address => bool) public kycApproved;
    mapping(address => bool) public accreditedInvestor;
    
    event AssetValuationUpdated(uint256 oldValuation, uint256 newValuation);
    event InvestorStatusUpdated(address investor, bool isAccredited);
    event KYCStatusUpdated(address investor, bool isApproved);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _assetId,
        string memory _assetType,
        uint256 _valuation,
        uint256 _totalShares
    ) ERC20(_name, _symbol) ERC20Permit(_name) {
        assetId = _assetId;
        assetType = _assetType;
        valuation = _valuation;
        totalShares = _totalShares;
        _mint(msg.sender, _totalShares);
    }

    function updateValuation(uint256 _newValuation) external onlyOwner {
        emit AssetValuationUpdated(valuation, _newValuation);
        valuation = _newValuation;
    }

    function setKYCStatus(address _investor, bool _status) external onlyOwner {
        kycApproved[_investor] = _status;
        emit KYCStatusUpdated(_investor, _status);
    }

    function setAccreditedStatus(address _investor, bool _status) external onlyOwner {
        accreditedInvestor[_investor] = _status;
        emit InvestorStatusUpdated(_investor, _status);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        require(kycApproved[from] || from == address(0), "Sender not KYC approved");
        require(kycApproved[to] || to == address(0), "Receiver not KYC approved");
        super._beforeTokenTransfer(from, to, amount);
    }
} 