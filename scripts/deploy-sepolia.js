const { ethers } = require("hardhat");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function main() {
  // Check if PRIVATE_KEY is loaded
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in environment variables. Please check your .env file.");
  }
  
  // PRIVATE_KEY is loaded from .env file (not logged for security)
  
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No signers found. Please check your PRIVATE_KEY in .env file.");
  }
  const deployer = signers[0];
  console.log("Deploying contracts to Sepolia with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.warn("⚠️  Warning: Account balance is 0. You need Sepolia ETH to deploy contracts.");
  }

  // Deploy Chat contract (Sepolia version without FHE)
  console.log("\nDeploying Chat contract...");
  const Chat = await ethers.getContractFactory("contracts/ChatSepolia.sol:ChatSepolia");
  const chat = await Chat.deploy();
  await chat.waitForDeployment();
  const chatAddress = await chat.getAddress();
  console.log("ChatSepolia deployed to:", chatAddress);

  // Deploy Aggregation contract
  console.log("\nDeploying Aggregation contract...");
  const Aggregation = await ethers.getContractFactory("contracts/AggregationSepolia.sol:AggregationSepolia");
  const aggregation = await Aggregation.deploy(chatAddress);
  await aggregation.waitForDeployment();
  const aggregationAddress = await aggregation.getAddress();
  console.log("AggregationSepolia deployed to:", aggregationAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("Network: Sepolia");
  console.log("Chat Contract:", chatAddress);
  console.log("Aggregation Contract:", aggregationAddress);
  console.log("\nSave these addresses for frontend configuration!");

  // Write addresses to a file for frontend
  const fs = require("fs");
  const addresses = {
    chat: chatAddress,
    aggregation: aggregationAddress,
    network: "sepolia",
    chainId: 11155111
  };
  fs.writeFileSync(
    "./frontend/src/contracts/addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("\nAddresses saved to frontend/src/contracts/addresses.json");
  
  console.log("\n✅ Deployment complete!");
  console.log("View on Etherscan:");
  console.log(`Chat: https://sepolia.etherscan.io/address/${chatAddress}`);
  console.log(`Aggregation: https://sepolia.etherscan.io/address/${aggregationAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

