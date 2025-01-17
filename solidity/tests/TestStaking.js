const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking Contract", () => {
  let Staking, staking, rewardToken, stakingToken, owner, addr1, addr2;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    stakingToken = await Token.deploy("StakingToken", "STK", ethers.utils.parseEther("1000000"));
    rewardToken = await Token.deploy("RewardToken", "RWD", ethers.utils.parseEther("1000000"));

    Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(
      stakingToken.address,
      rewardToken.address,
      ethers.utils.parseEther("0.01") // reward rate
    );
    await staking.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();

    // Fund the staking contract with rewards
    await rewardToken.transfer(staking.address, ethers.utils.parseEther("100000"));
  });

  it("Should allow users to stake tokens", async () => {
    await stakingToken.transfer(addr1.address, ethers.utils.parseEther("100"));
    await stakingToken.connect(addr1).approve(staking.address, ethers.utils.parseEther("100"));

    await staking.connect(addr1).stake(ethers.utils.parseEther("100"));
    expect(await stakingToken.balanceOf(staking.address)).to.equal(ethers.utils.parseEther("100"));
  });

  it("Should calculate rewards correctly", async () => {
    await stakingToken.transfer(addr1.address, ethers.utils.parseEther("100"));
    await stakingToken.connect(addr1).approve(staking.address, ethers.utils.parseEther("100"));

    await staking.connect(addr1).stake(ethers.utils.parseEther("100"));

    // Simulate time passing
    await ethers.provider.send("evm_increaseTime", [3600]); // 1 hour
    await ethers.provider.send("evm_mine");

    const stakeInfo = await staking.stakes(addr1.address);
    expect(stakeInfo.rewardDebt).to.be.closeTo(ethers.utils.parseEther("1"), ethers.utils.parseEther("0.01")); // 1 hour * 100 tokens * 0.01 reward rate
  });

  it("Should allow users to withdraw staked tokens and rewards", async () => {
    await stakingToken.transfer(addr1.address, ethers.utils.parseEther("100"));
    await stakingToken.connect(addr1).approve(staking.address, ethers.utils.parseEther("100"));

    await staking.connect(addr1).stake(ethers.utils.parseEther("100"));

    // Simulate time passing
    await ethers.provider.send("evm_increaseTime", [3600]); // 1 hour
    await ethers.provider.send("evm_mine");

    await staking.connect(addr1).withdraw();
    expect(await stakingToken.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("100"));
    expect(await rewardToken.balanceOf(addr1.address)).to.be.closeTo(ethers.utils.parseEther("1"), ethers.utils.parseEther("0.01"));
  });
});
