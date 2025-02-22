// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IValuationContract.sol";
import "../interfaces/ILendingPool.sol";

contract MockFlashLoanAttack is Ownable {
    IValuationContract public valuationContract;
    ILendingPool public lendingPool;
    IERC20 public token;
    
    constructor(
        address _valuationContract,
        address _lendingPool,
        address _token
    ) {
        valuationContract = IValuationContract(_valuationContract);
        lendingPool = ILendingPool(_lendingPool);
        token = IERC20(_token);
    }
    
    // Function to initiate flash loan attack
    function executeFlashLoanAttack(
        bytes32 assetId,
        uint256 amount
    ) external {
        // Request flash loan
        lendingPool.flashLoan(
            address(this),
            address(token),
            amount,
            abi.encode(assetId)
        );
    }
    
    // Callback function for flash loan
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool) {
        require(msg.sender == address(lendingPool), "Unauthorized");
        
        // Decode the asset ID from params
        bytes32 assetId = abi.decode(params, (bytes32));
        
        // Attempt price manipulation with flash loan
        try valuationContract.submitValuation(assetId, amount) {
            // If successful, try to profit from the manipulation
            valuationContract.requestValuation(assetId);
        } catch {
            // If failed, handle gracefully
        }
        
        // Approve repayment
        uint256 amountToRepay = amount + premium;
        token.approve(address(lendingPool), amountToRepay);
        
        return true;
    }
    
    // Function to recover tokens
    function rescueTokens(address tokenAddress) external onlyOwner {
        IERC20(tokenAddress).transfer(
            owner(),
            IERC20(tokenAddress).balanceOf(address(this))
        );
    }
} 