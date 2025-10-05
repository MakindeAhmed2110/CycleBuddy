import { ethers } from "hardhat";
import { SimpleStorage } from "../../typechain-types";

interface DeployInstance {
  owner: any;
  otherAccount: any;
  otherAccounts: any[];
  simpleStorageContract: SimpleStorage;
}

let cachedDeployInstance: DeployInstance | undefined = undefined;

export const getOrDeployContractInstances = async ({
  forceDeploy = false,
  printLogs = false,
}) => {
  if (!forceDeploy && cachedDeployInstance !== undefined) {
    return cachedDeployInstance;
  }

  const [owner, otherAccount, ...otherAccounts] = await ethers.getSigners();

  printLogs && console.log("Deployer address", owner.address);

  printLogs && console.log("Deploying SimpleStorage contract");
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorageContract = await SimpleStorage.deploy({
    from: owner.address,
  });
  await simpleStorageContract.waitForDeployment();
  const simpleStorageContractAddress = await simpleStorageContract.getAddress();

  printLogs &&
    console.log(
      `SimpleStorage contract deployed at ${simpleStorageContractAddress}`
    );

  cachedDeployInstance = {
    owner,
    otherAccount,
    otherAccounts,
    simpleStorageContract,
  };
  return cachedDeployInstance as DeployInstance;
};
