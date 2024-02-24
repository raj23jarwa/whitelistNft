import axios from "redaxios"

const { VITE_PINATA_KEY, VITE_PINATA_SECRET } = import.meta.env

// Pinata docs: https://docs.pinata.cloud/pinata-api/pinning/pin-json
export const pinJSONToIPFS = async (metadata) => {
    const data = JSON.stringify(metadata)
    const config = {
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        headers: {
            "Content-Type": "application/json",
            pinata_api_key: VITE_PINATA_KEY,
            pinata_secret_api_key: VITE_PINATA_SECRET,
        },
        data: data,
    }

    try {
        const res = await axios(config)
        return {
            success: true,
            pinataUrl: "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash,
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
        }
    }
}


// https://docs.pinata.cloud/reference/post_pinning-pinjsontoipfs
// const options = {
//     method: 'POST',
//     headers: {accept: 'application/json', 'content-type': 'application/json'},
//     body: JSON.stringify({
//       pinataContent: {somekey: 'somevalue'},
//       pinataOptions: {cidVersion: 1},
//       pinataMetadata: {name: 'pinnie.json'}
//     })
//   };

//   fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', options)
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));