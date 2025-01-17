// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Staking is AccessControl, ReentrancyGuard {
    IERC20 public stakingToken; // Token used for staking
    IERC20 public rewardToken;  // Token used for rewards

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint256 public rewardRate; // Reward rate per second
    uint256 public totalStaked; // Total tokens staked

    struct Stake {
        uint256 amount; // Amount staked
        uint256 rewardDebt; // Rewards already paid
        uint256 lastUpdated; // Timestamp of last interaction
    }

    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    constructor(IERC20 _stakingToken, IERC20 _rewardToken, uint256 _rewardRate) {
        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
        rewardRate = _rewardRate;

        // Grant deployer the admin role
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Stake tokens into the contract.
     * @param amount Amount of tokens to stake.
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Staking: Cannot stake 0");

        // Update user rewards before staking
        _updateReward(msg.sender);

        // Transfer staking tokens to the contract
        stakingToken.transferFrom(msg.sender, address(this), amount);

        // Update user stake and total staked
        stakes[msg.sender].amount += amount;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Withdraw staked tokens along with rewards.
     */
    function withdraw() external nonReentrant {
        Stake storage stakeInfo = stakes[msg.sender];
        uint256 amount = stakeInfo.amount;

        require(amount > 0, "Staking: No tokens to withdraw");

        // Update user rewards before withdrawal
        _updateReward(msg.sender);

        // Reset user stake and total staked
        stakeInfo.amount = 0;
        totalStaked -= amount;

        // Transfer tokens back to the user
        stakingToken.transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Claim accumulated rewards.
     */
    function claimReward() external nonReentrant {
        _updateReward(msg.sender);

        uint256 reward = stakes[msg.sender].rewardDebt;

        require(reward > 0, "Staking: No rewards to claim");

        stakes[msg.sender].rewardDebt = 0;
        rewardToken.transfer(msg.sender, reward);

        emit RewardPaid(msg.sender, reward);
    }

    /**
     * @notice Emergency withdraw staked tokens without rewards.
     */
    function emergencyWithdraw() external nonReentrant {
        Stake storage stakeInfo = stakes[msg.sender];
        uint256 amount = stakeInfo.amount;

        require(amount > 0, "Staking: No tokens to withdraw");

        // Reset user stake and total staked
        stakeInfo.amount = 0;
        stakeInfo.rewardDebt = 0;
        totalStaked -= amount;

        // Transfer tokens back to the user
        stakingToken.transfer(msg.sender, amount);

        emit EmergencyWithdraw(msg.sender, amount);
    }

    /**
     * @notice Set the reward rate (Admin only).
     * @param _rewardRate New reward rate.
     */
    function setRewardRate(uint256 _rewardRate) external onlyRole(ADMIN_ROLE) {
        rewardRate = _rewardRate;
    }

    /**
     * @dev Update user rewards based on the current reward rate and staking duration.
     * @param user Address of the user.
     */
    function _updateReward(address user) internal {
        Stake storage stakeInfo = stakes[user];
        if (stakeInfo.amount > 0) {
            uint256 accumulatedReward = ((block.timestamp - stakeInfo.lastUpdated) *
                stakeInfo.amount *
                rewardRate) / 1e18;
            stakeInfo.rewardDebt += accumulatedReward;
        }
        stakeInfo.lastUpdated = block.timestamp;
    }
}
