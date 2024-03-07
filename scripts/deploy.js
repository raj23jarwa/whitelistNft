const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const MyNFT = await ethers.getContractFactory('MyNFT');
  const mynft = await MyNFT.deploy();

  console.log('whiteListNFT address:', mynft.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
