// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./AssetToken.sol";

contract Market is ReentrancyGuard, Ownable {
    struct Order {
        address seller;
        address token;
        uint256 amount;
        uint256 price;
        bool active;
    }

    struct Trade {
        address seller;
        address buyer;
        address token;
        uint256 amount;
        uint256 price;
        uint256 timestamp;
    }

    mapping(bytes32 => Order) public orders;
    mapping(address => bytes32[]) public userOrders;
    mapping(address => bool) public supportedTokens;
    
    uint256 public tradingFee = 25; // 0.25%
    uint256 public constant FEE_DENOMINATOR = 10000;

    event OrderCreated(bytes32 indexed orderId, address indexed seller, address token, uint256 amount, uint256 price);
    event OrderCancelled(bytes32 indexed orderId);
    event OrderFilled(bytes32 indexed orderId, address indexed buyer, uint256 amount);
    event TokenListed(address indexed token, bool status);
    event TradingFeeUpdated(uint256 newFee);

    modifier validOrder(bytes32 orderId) {
        require(orders[orderId].active, "Order not active");
        _;
    }

    function createOrder(
        address _token,
        uint256 _amount,
        uint256 _price
    ) external nonReentrant returns (bytes32) {
        require(supportedTokens[_token], "Token not supported");
        require(_amount > 0, "Invalid amount");
        require(_price > 0, "Invalid price");

        IERC20 token = IERC20(_token);
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        bytes32 orderId = keccak256(
            abi.encodePacked(
                msg.sender,
                _token,
                _amount,
                _price,
                block.timestamp
            )
        );

        orders[orderId] = Order({
            seller: msg.sender,
            token: _token,
            amount: _amount,
            price: _price,
            active: true
        });

        userOrders[msg.sender].push(orderId);
        
        emit OrderCreated(orderId, msg.sender, _token, _amount, _price);
        return orderId;
    }

    function fillOrder(bytes32 _orderId) external payable nonReentrant validOrder(_orderId) {
        Order storage order = orders[_orderId];
        require(msg.value == order.price * order.amount / 1e18, "Incorrect payment");

        uint256 feeAmount = (msg.value * tradingFee) / FEE_DENOMINATOR;
        uint256 sellerAmount = msg.value - feeAmount;

        // Transfer tokens to buyer
        IERC20(order.token).transfer(msg.sender, order.amount);
        
        // Transfer ETH to seller
        payable(order.seller).transfer(sellerAmount);
        
        // Keep fee in contract
        order.active = false;

        emit OrderFilled(_orderId, msg.sender, order.amount);
    }

    function cancelOrder(bytes32 _orderId) external nonReentrant validOrder(_orderId) {
        Order storage order = orders[_orderId];
        require(msg.sender == order.seller, "Not seller");

        order.active = false;
        IERC20(order.token).transfer(msg.sender, order.amount);

        emit OrderCancelled(_orderId);
    }

    function listToken(address _token, bool _status) external onlyOwner {
        supportedTokens[_token] = _status;
        emit TokenListed(_token, _status);
    }

    function updateTradingFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee too high"); // Max 10%
        tradingFee = _newFee;
        emit TradingFeeUpdated(_newFee);
    }

    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // View functions
    function getOrder(bytes32 _orderId) external view returns (
        address seller,
        address token,
        uint256 amount,
        uint256 price,
        bool active
    ) {
        Order storage order = orders[_orderId];
        return (
            order.seller,
            order.token,
            order.amount,
            order.price,
            order.active
        );
    }

    function getUserOrders(address _user) external view returns (bytes32[] memory) {
        return userOrders[_user];
    }
} 