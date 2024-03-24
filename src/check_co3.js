import {compose} from "@taquito/taquito";
import {tzip16} from "@taquito/tzip16";
import {TokenIdNotFound, tzip12} from "@taquito/tzip12";


export const check_co3_possession = async (tezos, sc_address, address) => {
    console.log("Checking CO3 possession for address:", address);
    const contract = await tezos.contract.at(sc_address, compose(tzip16, tzip12));
    let idx = 0;
    while (true) {
        let tok_metadata = '';
        try {
            tok_metadata = await contract.tzip12().getTokenMetadata(idx);
        } catch (e) {
            console.log("Error when fetching token metadata: ", e);
            if (e instanceof TokenIdNotFound)
                return null;
        }
        if (tok_metadata.owner === address)
            return tok_metadata;
        idx++;
    }
};

export const fetch_co3_balance = async (tezos, sc_address, address) => {
    const tok_metadata = await check_co3_possession(tezos, sc_address, address);
    if (tok_metadata === null) {
        console.log("no token found for", address);
        return 0;
    }
    return tok_metadata.CO3;
};

export const upload_to_ipfs = async (data) => {
    const ipfs_api_jwt = import.meta.env.VITE_IPFS_API_JWT;
    try {
        let formData = new FormData();
        formData.append('file', new Blob([data], {type: 'file'}));
        formData.append("pinataMetadata", JSON.stringify({name: "CO3 Certificate"}));
        const res = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
            method: 'POST',
            headers: {Authorization: `Bearer ${ipfs_api_jwt}`},
            body: formData,
        });
        return res.json();
    } catch (error) {
        console.log('error when uploading to ipfs', error);
        throw error;
    }
}