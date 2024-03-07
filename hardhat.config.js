/* eslint-env node */
require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

const {
	VITE_ALCHEMY_API_URL,
	VITE_PRIVATE_KEY,
	VITE_ETHERSCAN_API_KEY,
	// VITE_ALCHEMY_API_KEY
} = process.env

const ALCHEMY_API_URL= VITE_ALCHEMY_API_URL;
// const ALCHEMY_API_KEY = VITE_ALCHEMY_API_KEY;
const SEPOLIA_PRIVATE_KEY = VITE_PRIVATE_KEY;
module.exports = {

	networks: {
		sepolia: {
			url: ALCHEMY_API_URL,
			accounts: [`${SEPOLIA_PRIVATE_KEY}`],
		}
	},
	solidity: {
		version: "0.8.20",
		settings: {
			optimizer: { enabled: true, runs: 200 }
		}
	},
	etherscan: {
		apiKey: VITE_ETHERSCAN_API_KEY
	}
}