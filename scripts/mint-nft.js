/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* global ethers */

// eslint-disable-next-line no-undef, no-unused-vars
const {
	VITE_PRIVATE_KEY,
	VITE_PRIVATE_KEY2,
	VITE_CONTRACT_ADDRESS,
	VITE_CONTRACT_ADDRESS_LOCAL
} = process.env

// nft-metadata.json uploaded to Pinata => contains 2 properties and an image url (also uploaded to Pinata)
const tokenURI =
	"https://gateway.pinata.cloud/ipfs/QmdL2w5D2J2HGuWSHYvtPtJemHhD2zfnv8Z2RT7MWLYF2y"

let provider, signer, signer2, contract, txn, txnReceipt
const gasLimit = 200000 // Set an appropriate gas limit value

async function main() {
	provider = ethers.provider
	const currentNetwork = await provider.getNetwork()

	if (currentNetwork.chainId.toString().includes(1337)) {
		console.log("We are using a local network!")
		contract = await ethers.getContractAt("MyNFT", VITE_CONTRACT_ADDRESS_LOCAL)
		;[signer, signer2] = await ethers.getSigners()
	} else {
		console.log("We are using a remote network!")
		contract = await ethers.getContractAt("MyNFT", VITE_CONTRACT_ADDRESS)
		;[signer] = await ethers.getSigners()
		//we could also use the following:
		//signer = new ethers.Wallet(VITE_PRIVATE_KEY, provider)
		signer2 = new ethers.Wallet(VITE_PRIVATE_KEY2, provider)
	}

	console.log("DEBUG - Token URI: ", tokenURI) // Log the tokenURI for debugging

	// mint an NFT to signer2
	txn = await contract.mintNFT(signer2.address, tokenURI)
	txnReceipt = await txn.wait()

	// display how many NFT's (of this specific contract) are owned by the recipient
	console.log(
		"Number of NFT's owned by the recipient: ",
		await contract.balanceOf(signer2.address)
	)

	// display the owner of NFT with Id = 1
	console.log("Owner of NFT with Id 1: ", await contract.ownerOf(1))

	// Step 1: Ownership Check
	const currentOwner = await contract.ownerOf(1)
	console.log("Current owner of NFT with ID 1: ", currentOwner)

	// Ensure that the current owner matches the expected account
	if (currentOwner !== "0xCD56fbE54FA65660037B0a1Bb233A1c92629e3B8") {
		console.error("The account is not the owner of the NFT with ID 1. The current owner is :", currentOwner)
		// Handle this case appropriately, maybe throw an error or return.
	}

	// Step 2: Approval Check and Approval
	const isApproved = await contract.getApproved(1)

	// If not approved, perform the approval
	if (isApproved !== signer2.address) {
		const approvalTxn = await contract.approve(signer2.address, 1)
		await approvalTxn.wait()
	}

	// transfer NFT with Id = 1 to another account
	contract = await contract.connect(signer2)
	txn = await contract["safeTransferFrom(address,address,uint256)"](
		signer2.address,
		signer.address,
		1,
		{ gasLimit }
	)
	txnReceipt = await txn.wait()

	// Additional logging for debugging
	console.log("Transaction Receipt: ", txnReceipt)
	console.log(
		"Number of NFT's owned by the recipient:",
		await contract.balanceOf(signer2.address)
	)
	console.log("Owner of NFT with Id 1:", await contract.ownerOf(1))
}

main()

// signer2 is the current token owner
// npx hardhat run scripts/mint-nft.js --network sepolia
