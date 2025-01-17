const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Contract", () => {
  let Token, token, owner, addr1, addr2;

  beforeEach(async () => {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2] = await ethers.getSigners();
    token = await Token.deploy("ExtensiveToken", "EXT", 1000);
    await token.deployed();
  });

  it("Should deploy the contract and assign the initial supply to the owner", async () => {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(ethers.utils.parseUnits("1000", 18));
    expect(ownerBalance).to.equal(await token.totalSupply());
  });

  it("Should allow minting by MINTER_ROLE", async () => {
    await token.grantRole(await token.MINTER_ROLE(), addr1.address);
    await token.connect(addr1).mint(addr2.address, ethers.utils.parseUnits("100", 18));
    expect(await token.balanceOf(addr2.address)).to.equal(ethers.utils.parseUnits("100", 18));
  });

  it("Should not allow minting without MINTER_ROLE", async () => {
    await expect(
      token.connect(addr1).mint(addr2.address, ethers.utils.parseUnits("100", 18))
    ).to.be.revertedWith("AccessControl: account");
  });

  it("Should allow pausing and unpausing by PAUSER_ROLE", async () => {
    await token.grantRole(await token.PAUSER_ROLE(), addr1.address);

    // Pause the contract
    await token.connect(addr1).pause();
    await expect(token.transfer(addr2.address, ethers.utils.parseUnits("50", 18))).to.be.revertedWith(
      "Pausable: paused"
    );

    // Unpause the contract
    await token.connect(addr1).unpause();
    await token.transfer(addr2.address, ethers.utils.parseUnits("50", 18));
    expect(await token.balanceOf(addr2.address)).to.equal(ethers.utils.parseUnits("50", 18));
  });

  it("Should allow burning tokens", async () => {
    await token.transfer(addr1.address, ethers.utils.parseUnits("100", 18));
    await token.connect(addr1).burn(ethers.utils.parseUnits("50", 18));
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.utils.parseUnits("50", 18));
    expect(await token.totalSupply()).to.equal(ethers.utils.parseUnits("950", 18));
  });

  it("Should create a snapshot", async () => {
    const snapshotId1 = await token.snapshot();
    await token.transfer(addr1.address, ethers.utils.parseUnits("100", 18));
    const snapshotId2 = await token.snapshot();
    expect(snapshotId1.blockNumber).to.be.lessThan(snapshotId2.blockNumber);
  });

  it("Should handle role assignment and revocation", async () => {
    const ADMIN_ROLE = await token.ADMIN_ROLE();
    const MINTER_ROLE = await token.MINTER_ROLE();

    // Grant and revoke roles
    await token.grantRole(MINTER_ROLE, addr1.address);
    expect(await token.hasRole(MINTER_ROLE, addr1.address)).to.equal(true);

    await token.revokeRole(MINTER_ROLE, addr1.address);
    expect(await token.hasRole(MINTER_ROLE, addr1.address)).to.equal(false);

    // Only ADMIN_ROLE can grant roles
    await expect(token.connect(addr1).grantRole(ADMIN_ROLE, addr2.address)).to.be.revertedWith(
      "AccessControl: account"
    );
  });
});
