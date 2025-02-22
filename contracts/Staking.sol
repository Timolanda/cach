// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Staking is ReentrancyGuard, Ownable, Pausable {
    struct Validator {
        uint256 stakedAmount;
        uint256 lastRewardsClaim;
        bool isActive;
        uint256 reputationScore;
        uint256 validationsCount;
    }

    IERC20 public stakingToken;
    uint256 public minimumStake = 50000e18; // 50,000 tokens
    uint256 public validatorCount;
    uint256 public totalStaked;
    uint256 public rewardsPerValidation = 10e18; // 10 tokens per validation
    uint256 public slashingPenalty = 1000e18; // 1,000 tokens
    uint256 public constant REPUTATION_THRESHOLD = 80;
    uint256 public constant MAX_VALIDATORS = 100;

    mapping(address => Validator) public validators;
    mapping(address => uint256) public pendingRewards;

    event ValidatorStaked(address indexed validator, uint256 amount);
    event ValidatorUnstaked(address indexed validator, uint256 amount);
    event RewardsClaimed(address indexed validator, uint256 amount);
    event ValidatorSlashed(address indexed validator, uint256 amount, string reason);
    event ValidationPerformed(address indexed validator, string assetId, uint256 reward);
    event ReputationUpdated(address indexed validator, uint256 newScore);

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    function stake(uint256 _amount) external nonReentrant whenNotPaused {
        require(_amount >= minimumStake, "Below minimum stake");
        require(!validators[msg.sender].isActive, "Already a validator");
        require(validatorCount < MAX_VALIDATORS, "Max validators reached");

        require(stakingToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        validators[msg.sender] = Validator({
            stakedAmount: _amount,
            lastRewardsClaim: block.timestamp,
            isActive: true,
            reputationScore: 100,
            validationsCount: 0
        });

        validatorCount++;
        totalStaked += _amount;

        emit ValidatorStaked(msg.sender, _amount);
    }

    function unstake() external nonReentrant {
        Validator storage validator = validators[msg.sender];
        require(validator.isActive, "Not a validator");
        
        uint256 amount = validator.stakedAmount;
        uint256 rewards = pendingRewards[msg.sender];
        
        validator.stakedAmount = 0;
        validator.isActive = false;
        pendingRewards[msg.sender] = 0;
        validatorCount--;
        totalStaked -= amount;

        require(stakingToken.transfer(msg.sender, amount + rewards), "Transfer failed");
        
        emit ValidatorUnstaked(msg.sender, amount);
        if (rewards > 0) {
            emit RewardsClaimed(msg.sender, rewards);
        }
    }

    function recordValidation(address _validator, string memory _assetId) external onlyOwner {
        require(validators[_validator].isActive, "Not an active validator");
        
        validators[_validator].validationsCount++;
        pendingRewards[_validator] += rewardsPerValidation;
        
        emit ValidationPerformed(_validator, _assetId, rewardsPerValidation);
    }

    function claimRewards() external nonReentrant {
        uint256 rewards = pendingRewards[msg.sender];
        require(rewards > 0, "No rewards to claim");
        
        pendingRewards[msg.sender] = 0;
        require(stakingToken.transfer(msg.sender, rewards), "Transfer failed");
        
        emit RewardsClaimed(msg.sender, rewards);
    }

    function slash(address _validator, uint256 _amount, string memory _reason) external onlyOwner {
        Validator storage validator = validators[_validator];
        require(validator.isActive, "Not an active validator");
        require(_amount <= validator.stakedAmount, "Amount exceeds stake");

        validator.stakedAmount -= _amount;
        totalStaked -= _amount;
        
        // Update reputation score
        uint256 newScore = validator.reputationScore > 20 ? validator.reputationScore - 20 : 0;
        validator.reputationScore = newScore;

        if (validator.stakedAmount < minimumStake || newScore < REPUTATION_THRESHOLD) {
            validator.isActive = false;
            validatorCount--;
        }

        emit ValidatorSlashed(_validator, _amount, _reason);
        emit ReputationUpdated(_validator, newScore);
    }

    function updateReputationScore(address _validator, uint256 _newScore) external onlyOwner {
        require(_newScore <= 100, "Invalid score");
        validators[_validator].reputationScore = _newScore;
        
        if (_newScore < REPUTATION_THRESHOLD && validators[_validator].isActive) {
            validators[_validator].isActive = false;
            validatorCount--;
        }
        
        emit ReputationUpdated(_validator, _newScore);
    }

    // Admin functions
    function setMinimumStake(uint256 _newMinimum) external onlyOwner {
        minimumStake = _newMinimum;
    }

    function setRewardsPerValidation(uint256 _newReward) external onlyOwner {
        rewardsPerValidation = _newReward;
    }

    function setSlashingPenalty(uint256 _newPenalty) external onlyOwner {
        slashingPenalty = _newPenalty;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // View functions
    function getValidatorInfo(address _validator) external view returns (
        uint256 stakedAmount,
        uint256 pendingReward,
        bool isActive,
        uint256 reputationScore,
        uint256 validationsCount
    ) {
        Validator memory validator = validators[_validator];
        return (
            validator.stakedAmount,
            pendingRewards[_validator],
            validator.isActive,
            validator.reputationScore,
            validator.validationsCount
        );
    }
} 