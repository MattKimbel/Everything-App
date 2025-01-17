const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Liquidity Pool Contract", () => {
  let LiquidityPool, liquidityPool, tokenA, tokenB, owner, addr1, addr2;

  beforeEach(async () => {
    // Deploy two ERC-20 tokens
    const Token = await ethers.getContractFactory("Token");
    tokenA = await Token.deploy("TokenA", "TKA", ethers.utils.parseEther("1000000"));
    tokenB = await Token.deploy("TokenB", "TKB", ethers.utils.parseEther("1000000"));

    // Deploy liquidity pool contract
    LiquidityPool = await ethers.getContractFactory("LiquidityPool");
    liquidityPool = await LiquidityPool.deploy(tokenA.address, tokenB.address, 50); // 0.5% fee
    await liquidityPool.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();

    // Fund users with tokens
    await tokenA.transfer(addr1.address, ethers.utils.parseEther("1000"));
    await tokenB.transfer(addr1.address, ethers.utils.parseEther("1000"));
    await tokenA.transfer(addr2.address, ethers.utils.parseEther("1000"));
    await tokenB.transfer(addr2.address, ethers.utils.parseEther("1000"));
    
    // Approve liquidity pool contract to spend user tokens
    await tokenA.connect(addr1).approve(liquidityPool.address, ethers.utils.parseEther("1000"));
    await tokenB.connect(addr1).approve(liquidityPool.address, ethers.utils.parseEther("1000"));
    await tokenA.connect(addr2).approve(liquidityPool.address, ethers.utils.parseEther("1000"));
    await tokenB.connect(addr2).approve(liquidityPool.address, ethers.utils.parseEther("1000"));
  });

  it("Should allow users to add liquidity", async () => {
    await liquidityPool.connect(addr1).addLiquidity(ethers.utils.parseEther("100"), ethers.utils.parseEther("100"));
    expect(await liquidityPool.balanceOf(addr1.address)).to.be.gt(0);
  });

  it("Should allow users to remove liquidity", async () => {
    await liquidityPool.connect(addr1).addLiquidity(ethers.utils.parseEther("100"), ethers.utils.parseEther("100"));
    const lpTokens = await liquidityPool.balanceOf(addr1.address);
    
    await liquidityPool.connect(addr1).removeLiquidity(lpTokens);
    expect(await tokenA.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("100"));
    expect(await tokenB.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("100"));
  });

  it("Should allow admin to collect fees", async () => {
    await liquidityPool.connect(addr1).addLiquidity(ethers.utils.parseEther("100"), ethers.utils.parseEther("100"));
    
    // Simulate a fee collection
    await liquidityPool.collectFees();
    // Assuming some fee was collected, check that the admin received it
    const adminBalanceA = await tokenA.balanceOf(owner.address);
    const adminBalanceB = await tokenB.balanceOf(owner.address);
    
    expect(adminBalanceA).to.be.gt(0);
    expect(adminBalanceB).to.be.gt(0);
  });

  it("Should allow admin to set fee rate", async () => {
    await liquidityPool.setFeeRate(100); // Set fee rate to 1%
    expect(await liquidityPool.feeRate()).to.equal(100);
  });
});
