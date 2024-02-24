/* global ethers */

async function testContract() {
	let account2Address = "0xCD56fbE54FA65660037B0a1Bb233A1c92629e3B8" // dev-receiver-provider

	let contract = await ethers.getContractAt(
		"MyNFT",
		"0xA56CA66c508cF329f39b3e4A6B658296C194AE39"
	)

	let balanceBefore = await contract.balanceOf(account2Address)
	console.log(
		`Balance of tokens for ${account2Address} before minting: ${balanceBefore.toNumber()}`
	)

	// Call mintNFT to mint a new token
	let tokenURI =
		"https://gateway.pinata.cloud/ipfs/QmehEf1AhRVcsNch1bw3Ms1Xz3q2nHf4aVwAZk7EKN9vbo"
	let txn = await contract.mintNFT(account2Address, tokenURI)
	let txnReceipt = await txn.wait()
	console.log("txnReceipt: ", txnReceipt)

	// Call a read-only function to check the owner of token ID 1
	let ownerAfter = await contract.ownerOf(1)
	console.log("The owner of token with Id 1 after minting: ", ownerAfter)

	// Check the balance after minting
	let balanceAfter = await contract.balanceOf(account2Address)
	console.log(
		`Balance of tokens for ${account2Address} after minting: ${balanceAfter.toNumber()}`
	)

	// Check Transfer events
	let filter = contract.filters.Transfer(null, account2Address, null)
	let logs = await contract.queryFilter(filter, "latest", "latest")
	console.log("Logs: ", logs)
}

testContract()
