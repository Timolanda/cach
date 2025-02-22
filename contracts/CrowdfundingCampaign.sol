// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CrowdfundingCampaign is ReentrancyGuard, Ownable {
    struct Campaign {
        string id;
        address assetToken;
        uint256 targetAmount;
        uint256 minInvestment;
        uint256 raisedAmount;
        uint256 deadline;
        bool finalized;
        mapping(address => uint256) investments;
    }

    Campaign public campaign;
    mapping(address => bool) public whitelisted;
    
    event InvestmentMade(address investor, uint256 amount);
    event CampaignFinalized(bool successful, uint256 totalRaised);
    event InvestorWhitelisted(address investor, bool status);
    event FundsRefunded(address investor, uint256 amount);

    constructor(
        string memory _id,
        address _assetToken,
        uint256 _targetAmount,
        uint256 _minInvestment,
        uint256 _duration
    ) {
        campaign.id = _id;
        campaign.assetToken = _assetToken;
        campaign.targetAmount = _targetAmount;
        campaign.minInvestment = _minInvestment;
        campaign.deadline = block.timestamp + _duration;
    }

    function invest() external payable nonReentrant {
        require(block.timestamp < campaign.deadline, "Campaign ended");
        require(!campaign.finalized, "Campaign finalized");
        require(whitelisted[msg.sender], "Not whitelisted");
        require(msg.value >= campaign.minInvestment, "Below min investment");
        
        campaign.investments[msg.sender] += msg.value;
        campaign.raisedAmount += msg.value;
        
        emit InvestmentMade(msg.sender, msg.value);
    }

    function finalizeCampaign() external onlyOwner nonReentrant {
        require(block.timestamp >= campaign.deadline, "Campaign still active");
        require(!campaign.finalized, "Already finalized");
        
        campaign.finalized = true;
        bool successful = campaign.raisedAmount >= campaign.targetAmount;
        
        if (successful) {
            // Transfer funds to asset owner
            payable(owner()).transfer(address(this).balance);
            // Transfer tokens to investors
            IERC20 token = IERC20(campaign.assetToken);
            for (address investor : getInvestors()) {
                uint256 tokenAmount = calculateTokenAmount(campaign.investments[investor]);
                token.transfer(investor, tokenAmount);
            }
        } else {
            // Refund investors
            for (address investor : getInvestors()) {
                uint256 amount = campaign.investments[investor];
                if (amount > 0) {
                    campaign.investments[investor] = 0;
                    payable(investor).transfer(amount);
                    emit FundsRefunded(investor, amount);
                }
            }
        }
        
        emit CampaignFinalized(successful, campaign.raisedAmount);
    }

    function whitelistInvestor(address _investor, bool _status) external onlyOwner {
        whitelisted[_investor] = _status;
        emit InvestorWhitelisted(_investor, _status);
    }

    function getInvestors() internal view returns (address[] memory) {
        // Implementation to return list of investors
    }

    function calculateTokenAmount(uint256 _investment) internal view returns (uint256) {
        // Implementation to calculate token amount based on investment
    }

    // Additional helper functions...
} 