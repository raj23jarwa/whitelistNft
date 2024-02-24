import { ethers } from "ethers"
import { pinJSONToIPFS } from "./pinata"
// import contractJson from "../MyNFT.json"
import contractJson from "../../artifacts/contracts/MyNFT.sol/MyNFT.json"

const { VITE_CONTRACT_ADDRESS, VITE_CONTRACT_ADDRESS_LOCAL, VITE_PRIVATE_KEY } =
	import.meta.env

let provider, signer, contractAddress, contract, selectedAddress

async function init() {
	// Checking for MetaMask: we very if MM is installed by calling. remember MM automatically injects the ethereum object into the global window namespace
	// MetaMask injects the provider API into websites visited by its users using the window.ethereum provider object.
	if (window.ethereum) {
		// Initializing the Web3Provider:
		// If MetaMask is detected, it creates a new Web3Provider from the ethers library using the MetaMask provider.
		provider = new ethers.providers.Web3Provider(window.ethereum)
		// Getting Current Network: It then retrieves the current network information using the getNetwork method of the provider.
		const currentNetwork = await provider.getNetwork()

		// Setting Contract Address based on Network:
		if (currentNetwork.chainId.toString().includes(1337)) {
			contractAddress = VITE_CONTRACT_ADDRESS_LOCAL
		} else {
			contractAddress = VITE_CONTRACT_ADDRESS
		}

		// the following is not required for this example => only required if we want to call
		// a function directly on a contract instance
		// Setting up Signer and Contract:
		signer = new ethers.Wallet(VITE_PRIVATE_KEY, provider)
		contract = new ethers.Contract(contractAddress, contractJson.abi, signer)
		console.log(contract)
	}
}

await init()

export const getCurrentWalletConnected = async () => {
	if (window.ethereum) {
		try {
			// accountsChanged
			// The provider emits this event when the return value of the eth_accounts RPC method changes. eth_accounts returns either an empty array, or an array that contains the addresses of the accounts the caller is permitted to access with the most recently used account first.
			// Does: Retrieves all MetaMask accounts that have already been connected with this DApp (eth_accounts) :
			const addressArray = await window.ethereum.request({
				method: "eth_accounts"
			})

			if (addressArray.length > 0) {
				selectedAddress = addressArray[0]
				return {
					address: selectedAddress,
					status:
						"👆🏽 Provide an image url, a name and a description for your NFT."
				}
			} else {
				return {
					address: "",
					status: "🦊 Connect to Metamask using the top right button."
				}
			}
		} catch (err) {
			return {
				address: "",
				status: "😥 " + err.message
			}
		}
	} else {
		return {
			address: "",
			status: (
				<span>
					<p>
						{" "}
						🦊{" "}
						<a
							target='_blank'
							rel='noreferrer'
							href={`https://metamask.io/download.html`}
						>
							You must install Metamask, a virtual Ethereum wallet, in your
							browser.
						</a>
					</p>
				</span>
			)
		}
	}
}

export const connectWallet = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_requestAccounts"
			})

			if (addressArray.length > 0) {
				selectedAddress = addressArray[0]
				return {
					address: selectedAddress,
					status:
						"👆🏽 Provide an image url, a name and a description for your NFT."
				}
			} else {
				return {
					address: "",
					status: "🦊 Connect to Metamask using the top right button."
				}
			}
		} catch (err) {
			return {
				address: "",
				status: "😥 " + err.message
			}
		}
	} else {
		return {
			address: "",
			status: (
				<span>
					<p>
						{" "}
						🦊{" "}
						<a
							target='_blank'
							rel='noreferrer'
							href={`https://metamask.io/download.html`}
						>
							You must install Metamask, a virtual Ethereum wallet, in your
							browser.
						</a>
					</p>
				</span>
			)
		}
	}
}

//image: https://gateway.pinata.cloud/ipfs/QmcSM8rxpnmknRu6HX9KWmqG4QJaBfijF3sZeuvSeDfNB7
export const mintNFT = async (name, description, imageUrl) => {
	if (
		name.trim() === "" ||
		description.trim() === "" ||
		imageUrl.trim() === ""
	) {
		return {
			success: false,
			status: "❗Please make sure all fields are completed before minting."
		}
	}

	//https://docs.pinata.cloud/pinata-api/pinning/pin-json
	const metadata = {
		pinataMetadata: {
			name: "Bestie NFT",
			keyvalues: {
				"some key": "some value"
			}
		},
		pinataContent: {
			name,
			description,
			image: imageUrl,
			attributes: [
				{
					trait_type: "People",
					value: "2"
				},
				{
					trait_type: "Location",
					value: "Paris"
				}
			]
		}
	}

	const pinataResponse = await pinJSONToIPFS(metadata)
	if (!pinataResponse.success) {
		return {
			success: false,
			status: "😢 Something went wrong while uploading your tokenURI."
		}
	}
	const tokenURI = pinataResponse.pinataUrl
	console.log(tokenURI)

	// Interface Initialization:
	// It creates an interface using the ethers.utils.Interface class. This interface is initialized with the function signature of the mintNFT function from the Ethereum smart contract. The mintNFT function is expected to take an address parameter for the recipient and a string parameter for the token URI.
	let iface = new ethers.utils.Interface([
		"function mintNFT(address recipient, string memory tokenURI)"
	])
	// Encoding Function Data:
	const myData = iface.encodeFunctionData("mintNFT", [
		selectedAddress,
		tokenURI
	])

	// It defines an object (transactionParameters) containing the necessary parameters for the Ethereum transaction
	const transactionParameters = {
		to: contractAddress,
		from: selectedAddress,
		data: myData
	}

	// It uses MetaMask's eth_sendTransaction method to send the transaction to the Ethereum network. The transactionParameters object is passed as a parameter, and the resulting transaction hash is awaited.
	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters]
		})

		// second option: call function directly on contract instance => no confirmation in Metamask
		//let txn = await contract.mintNFT(selectedAddress, tokenURI)
		//let txnReceipt = await txn.wait()

		// If the transaction is successful, it returns an object indicating success, along with a link to Etherscan where the user can check the transaction status. The transaction hash (txHash) is used to generate the link.

		return {
			success: true,
			status: (
				<a
					target='_blank'
					rel='noreferrer'
					href={`https://sepolia.etherscan.io/tx/${txHash}`}
				>
					✅ Check your transaction on Etherscan
				</a>
			)
		}
	} catch (error) {
		return {
			success: false,
			status: "😥 Something went wrong: " + error.message
		}
	}
}
