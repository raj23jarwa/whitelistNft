/* global ethers */

async function testSigner() {
    let provider = ethers.provider

    // getSigners() returns an array of signers, so you need to choose one
    // let signer = await ethers.getSigners()
    let [signer] = await ethers.getSigners();

    
    // we specify a second account address, to which we will send the ETH using the sendTransaction method
    let account2Address = "0xCD56fbE54FA65660037B0a1Bb233A1c92629e3B8"  // dev-receiver-provider 


    console.log("Signer address: ", await signer.getAddress())
    console.log("Balance Signer: ", await signer.getBalance())
    console.log("Balance Signer in ETH: ", ethers.utils.formatEther(await signer.getBalance()))
    console.log(
        "Balance before sending 0.1 ETH: ",
        ethers.utils.formatEther(await provider.getBalance(account2Address))
    )

    let txnParams = {
        to: account2Address,
        value: ethers.utils.parseEther("0.1"),
    }

    let txn = await signer.sendTransaction(txnParams)
    await txn.wait()

    console.log(
        "Balance after sending 0.1 ETH: ",
        ethers.utils.formatEther(await provider.getBalance(account2Address))
    )
}

testSigner()

// Sender/Signer address:  0x9b72920244D6d5A99125997C7368F8d9b49952CA  // dev-sender-signer
// Receiver/Provider address: 0xCD56fbE54FA65660037B0a1Bb233A1c92629e3B8 //dev-receiver-provider