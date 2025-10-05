import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  console.log("=== Deploying CycleBuddy Complete Setup ===");

  // 1. Deploy B3TR Mock Token
  console.log("1. Deploying B3TR Mock Token...");
  const B3TRMock = await ethers.getContractFactory("B3TR_Mock");
  const b3trToken = await B3TRMock.deploy();
  await b3trToken.waitForDeployment();
  const b3trAddress = await b3trToken.getAddress();
  console.log("B3TR Token deployed at:", b3trAddress);

  // 2. Deploy X2Earn Apps Mock
  console.log("2. Deploying X2Earn Apps Mock...");
  const X2EarnAppsMock = await ethers.getContractFactory("X2EarnAppsMock");
  const x2EarnApps = await X2EarnAppsMock.deploy(deployer.address);
  await x2EarnApps.waitForDeployment();
  const x2EarnAppsAddress = await x2EarnApps.getAddress();
  console.log("X2Earn Apps deployed at:", x2EarnAppsAddress);

  // 3. Deploy X2Earn Rewards Pool Mock
  console.log("3. Deploying X2Earn Rewards Pool Mock...");
  const X2EarnRewardsPoolMock = await ethers.getContractFactory("X2EarnRewardsPoolMock");
  const rewardsPool = await X2EarnRewardsPoolMock.deploy(
    deployer.address,
    b3trAddress,
    x2EarnAppsAddress
  );
  await rewardsPool.waitForDeployment();
  const rewardsPoolAddress = await rewardsPool.getAddress();
  console.log("Rewards Pool deployed at:", rewardsPoolAddress);

  // 4. Register CycleBuddy app in X2Earn Apps
  console.log("4. Registering CycleBuddy app...");
  const APP_ID = ethers.keccak256(ethers.toUtf8Bytes("CycleBuddy"));
  const addAppTx = await x2EarnApps.addApp(
    deployer.address, // team wallet
    deployer.address, // admin
    "CycleBuddy"
  );
  await addAppTx.wait();
  console.log("CycleBuddy app registered with ID:", APP_ID);

  // 5. Add deployer as reward distributor
  console.log("5. Adding deployer as reward distributor...");
  const addDistributorTx = await x2EarnApps.addRewardDistributor(APP_ID, deployer.address);
  await addDistributorTx.wait();
  console.log("Deployer added as reward distributor");

  // 6. Fund the rewards pool with B3TR tokens
  console.log("6. Funding rewards pool...");
  const FUND_AMOUNT = ethers.parseUnits("1000000", 18); // 1M B3TR
  const approveTx = await b3trToken.approve(rewardsPoolAddress, FUND_AMOUNT);
  await approveTx.wait();
  const depositTx = await rewardsPool.deposit(FUND_AMOUNT, APP_ID);
  await depositTx.wait();
  console.log("Rewards pool funded with 1M B3TR");

  // 7. Deploy CycleBuddy Rewards Contract
  console.log("7. Deploying CycleBuddy Rewards Contract...");
  const REWARD_PER_ACTIVITY = ethers.parseUnits("1", 18); // 1 B3TR per activity
  
  const CycleBuddyRewards = await ethers.getContractFactory("CycleBuddyRewards");
  const cycleBuddyRewards = await CycleBuddyRewards.deploy(
    deployer.address,          // admin
    rewardsPoolAddress,        // IX2EarnRewardsPool
    APP_ID,                    // appId
    REWARD_PER_ACTIVITY        // reward per activity
  );
  await cycleBuddyRewards.waitForDeployment();
  const cycleBuddyAddress = await cycleBuddyRewards.getAddress();
  console.log("CycleBuddy Rewards deployed at:", cycleBuddyAddress);

  // 8. Grant distributor role to CycleBuddy contract
  console.log("8. Granting distributor role to CycleBuddy contract...");
  const DISTRIBUTOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("DISTRIBUTOR_ROLE"));
  const grantRoleTx = await cycleBuddyRewards.grantRole(DISTRIBUTOR_ROLE, deployer.address);
  await grantRoleTx.wait();
  console.log("DISTRIBUTOR_ROLE granted to deployer");

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("B3TR Token:", b3trAddress);
  console.log("X2Earn Apps:", x2EarnAppsAddress);
  console.log("Rewards Pool:", rewardsPoolAddress);
  console.log("CycleBuddy Rewards:", cycleBuddyAddress);
  console.log("App ID:", APP_ID);
  console.log("\n=== TESTING ===");
  
  // Test the setup
  console.log("Testing reward distribution...");
  const testUser = deployer.address;
  const rewardTx = await cycleBuddyRewards.rewardPeriodLogging(testUser);
  await rewardTx.wait();
  console.log("✅ Period logging reward distributed successfully!");
  
  const userBalance = await b3trToken.balanceOf(testUser);
  console.log("User B3TR balance:", ethers.formatEther(userBalance));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
