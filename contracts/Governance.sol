// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Governance is Ownable, ReentrancyGuard {
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        bytes callData;
        address target;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    IERC20 public governanceToken;
    uint256 public proposalCount;
    uint256 public minVotingDelay = 1 days;
    uint256 public votingPeriod = 7 days;
    uint256 public quorum = 100000e18; // 100,000 tokens
    uint256 public proposalThreshold = 1000e18; // 1,000 tokens

    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) public votingPowerSnapshot;

    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        address target,
        string description
    );
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event GovernanceParametersUpdated(
        uint256 votingDelay,
        uint256 votingPeriod,
        uint256 quorum,
        uint256 proposalThreshold
    );

    constructor(address _governanceToken) {
        governanceToken = IERC20(_governanceToken);
    }

    function propose(
        address _target,
        bytes memory _callData,
        string memory _description
    ) external returns (uint256) {
        require(
            governanceToken.balanceOf(msg.sender) >= proposalThreshold,
            "Insufficient tokens to propose"
        );

        uint256 proposalId = ++proposalCount;
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.description = _description;
        proposal.callData = _callData;
        proposal.target = _target;
        proposal.startTime = block.timestamp + minVotingDelay;
        proposal.endTime = proposal.startTime + votingPeriod;

        emit ProposalCreated(proposalId, msg.sender, _target, _description);
        return proposalId;
    }

    function castVote(uint256 _proposalId, bool _support) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");

        uint256 votes = governanceToken.balanceOf(msg.sender);
        require(votes > 0, "No voting power");

        proposal.hasVoted[msg.sender] = true;
        if (_support) {
            proposal.votesFor += votes;
        } else {
            proposal.votesAgainst += votes;
        }

        emit VoteCast(_proposalId, msg.sender, _support, votes);
    }

    function executeProposal(uint256 _proposalId) external nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.endTime, "Voting still active");
        require(!proposal.executed, "Already executed");
        require(proposal.votesFor + proposal.votesAgainst >= quorum, "Quorum not reached");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");

        proposal.executed = true;

        (bool success, ) = proposal.target.call(proposal.callData);
        require(success, "Execution failed");

        emit ProposalExecuted(_proposalId);
    }

    function updateGovernanceParameters(
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _quorum,
        uint256 _proposalThreshold
    ) external onlyOwner {
        minVotingDelay = _votingDelay;
        votingPeriod = _votingPeriod;
        quorum = _quorum;
        proposalThreshold = _proposalThreshold;

        emit GovernanceParametersUpdated(
            _votingDelay,
            _votingPeriod,
            _quorum,
            _proposalThreshold
        );
    }

    // View functions
    function getProposal(uint256 _proposalId)
        external
        view
        returns (
            address proposer,
            string memory description,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 startTime,
            uint256 endTime,
            bool executed
        )
    {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.proposer,
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.startTime,
            proposal.endTime,
            proposal.executed
        );
    }
} 