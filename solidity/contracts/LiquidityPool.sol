// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LiquidityPool is AccessControl, ERC20 {
    using SafeMath for uint256;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public feeRate; // Fee rate for liquidity providers (in basis points, 100 basis points = 1%)

    event LiquidityAdded(address indexed user, uint256 amountA, uint256 amountB, uint256 lpTokensMinted);
    event LiquidityRemoved(address indexed user, uint256 amountA, uint256 amountB, uint256 lpTokensBurned);

    constructor(
        IERC20 _tokenA,
        IERC20 _tokenB,
        uint256 _feeRate
    ) ERC20("Liquidity Pool Token", "LPT") {
        tokenA = _tokenA;
        tokenB = _tokenB;
        feeRate = _feeRate;

        // Grant the deployer the admin role
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Add liquidity to the pool.
     * @param amountA Amount of tokenA to add to the pool.
     * @param amountB Amount of tokenB to add to the pool.
     */
    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(amountA > 0 && amountB > 0, "LiquidityPool: Invalid amounts");

        // Transfer tokens from the user to the contract
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        // Mint LP tokens based on the proportion of the tokens added
        uint256 totalSupply = totalSupply();
        uint256 lpTokensToMint;

        if (totalSupply == 0) {
            lpTokensToMint = amountA.add(amountB); // First liquidity, mint a total of the amount
        } else {
            uint256 ratioA = amountA.mul(totalSupply).div(balanceOf(address(this)));
            uint256 ratioB = amountB.mul(totalSupply).div(balanceOf(address(this)));

            lpTokensToMint = ratioA < ratioB ? ratioA : ratioB;
        }

        _mint(msg.sender, lpTokensToMint);

        emit LiquidityAdded(msg.sender, amountA, amountB, lpTokensToMint);
    }

    /**
     * @notice Remove liquidity from the pool.
     * @param lpTokens Amount of LP tokens to burn in exchange for liquidity.
     */
    function removeLiquidity(uint256 lpTokens) external {
        require(lpTokens > 0, "LiquidityPool: Invalid amount");

        uint256 totalLpSupply = totalSupply();
        uint256 amountA = balanceOf(address(this)).mul(lpTokens).div(totalLpSupply);
        uint256 amountB = balanceOf(address(this)).mul(lpTokens).div(totalLpSupply);

        // Burn the user's LP tokens
        _burn(msg.sender, lpTokens);

        // Transfer the liquidity tokens back to the user
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);

        emit LiquidityRemoved(msg.sender, amountA, amountB, lpTokens);
    }

    /**
     * @notice Collect the fees accumulated in the pool (only callable by the admin).
     */
    function collectFees() external onlyRole(ADMIN_ROLE) {
        uint256 balanceA = tokenA.balanceOf(address(this));
        uint256 balanceB = tokenB.balanceOf(address(this));

        uint256 feeA = balanceA.mul(feeRate).div(10000);
        uint256 feeB = balanceB.mul(feeRate).div(10000);

        tokenA.transfer(msg.sender, feeA);
        tokenB.transfer(msg.sender, feeB);
    }

    /**
     * @notice Set the fee rate (only callable by the admin).
     * @param _feeRate New fee rate (in basis points).
     */
    function setFeeRate(uint256 _feeRate) external onlyRole(ADMIN_ROLE) {
        feeRate = _feeRate;
    }
}
