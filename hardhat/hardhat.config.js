require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

// Initialize `dotenv` with the `.config()` function
require("dotenv").config({ path: ".env" });

// Environment variables should now be available
// under `process.env`
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const API_KEY = process.env.API_KEY;

// Show an error if environment variables are missing
if (!PRIVATE_KEY) {
  console.error("Missing PRIVATE_KEY environment variable");
}

if (!RPC_URL) {
  console.error("Missing RPC_URL environment variable");
}

if (!API_KEY) {
  console.error("Missing API_KEY environment variable");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    localhost: {
      chainId: 31337, // We set 1337 to make interacting with MetaMask simpler
    },
    fuji: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: API_KEY,
  },
};
