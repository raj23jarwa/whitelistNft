/* global ethers */
async function testProvider() {
	let provider = ethers.provider

	console.log(
		"Get the network the provider is connected to: ",
		await provider.getNetwork()
	)

	console.log(
		"Get balance of any account: ",
		await provider.getBalance("0x9b72920244D6d5A99125997C7368F8d9b49952CA")
		//dev-testing-trade address
		// Signer address:  0x9b72920244D6d5A99125997C7368F8d9b49952CA  // dev-testing-trade
	)

	console.log(
		"Balance in ETH: ",
		ethers.utils.formatEther(
			await provider.getBalance("0x9b72920244D6d5A99125997C7368F8d9b49952CA")
			//dev-testing-trade address
		)
	)

	console.log(
		"Block Number of most recently mined block: ",
		await provider.getBlockNumber()
	)

	console.log("Get current fee data: ", await provider.getFeeData())
}

testProvider()



// Sender/Signer address:  0x9b72920244D6d5A99125997C7368F8d9b49952CA  // dev-sender-signer
// Receiver/Provider address: 0xCD56fbE54FA65660037B0a1Bb233A1c92629e3B8 //dev-receiver-provider

// await provider.getBalance("0xB1b504848e1a5e90aEAA1D03A06ECEee55562803")