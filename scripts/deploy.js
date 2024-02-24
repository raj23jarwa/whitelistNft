/* eslint-env node */
/* global ethers */

const fs = require("fs")

async function main() {
    const MyNFTFactory = await ethers.getContractFactory("MyNFT")
    const myNFT = await MyNFTFactory.deploy()

    await myNFT.deployed()

    console.log("myNFT deployed to:", myNFT.address)

    const data = {
        address: myNFT.address,
        abi: JSON.parse(myNFT.interface.format("json")),
    }

    //writes the ABI and contract address to the MyNFT.json
    fs.writeFileSync("./src/MyNFT.json", JSON.stringify(data))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

// latest
// myNFT deployed to: 0xA56CA66c508cF329f39b3e4A6B658296C194AE39

// first
// myNFT deployed to: 0x2AB2FD773723299869812Cf0Abd1BBcc9f5dA7c8
// src/MyNFT.json address