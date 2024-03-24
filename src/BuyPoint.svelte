<script>
    import {stringToBytes} from "@taquito/utils";
    import {InMemorySigner} from "@taquito/signer";

    const pubkeyAddress = import.meta.env.VITE_PUBKEY_ADMIN;
    const sc_address = import.meta.env.VITE_SC_SBT_ADDRESS;
    const private_key = import.meta.env.VITE_PRIVATE_KEY_SC;
    const ipfs_api_jwt = import.meta.env.VITE_IPFS_API_JWT;

    const cost_grams = 0.000167 / 2.5; //

    export let co2_emit;
    export let user_buy;
    export let walletHandler;
    export let tezos;

    tezos.setProvider({signer: new InMemorySigner(private_key)});

    const upload_to_ipfs = async (data) => {
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

    const emit_nft = async (amount) => {
        const address = await walletHandler.getPKH();

        console.log('getting contract');
        const contract = await tezos.contract.at(sc_address);
        console.log('calling mint function');
        let json_metadata = JSON.stringify({
            name: "CO3 Certificate",
            description: "CO3 Certificate",
            rights: "No License",
            minter: sc_address.toString(),
            date: new Date().toISOString(),
            symbol: "CO3",
            decimals: 0,
            attributes: [],
            isBooleanAmount: false,
            shouldPreferSymbol: false,
            royalties: [],
            CO3: amount.toString(),
        });
        const ipfs_hash = await upload_to_ipfs(json_metadata);
        const op = await contract.methodsObject.mint([{
            to_: address,
            metadata: {"": stringToBytes(`ipfs://${ipfs_hash.IpfsHash}`)},
        }]).send();
        console.log('waiting for confirmation');
        const hash = await op.confirmation(1);
        console.log(`Operation injected https://ghost.tzstats.com/${hash}`);
        alert("A NFT Certificate have been sent, check your wallet on your favorite explorer !");
        user_buy = true;
    }

    const buy_CO3 = async (amount) => {
        try {
            tezos.setWalletProvider(walletHandler);
            const op = await tezos.wallet.transfer({to: pubkeyAddress, amount: amount}).send();
            await op.confirmation(1);
            await emit_nft(amount);
        } catch (e) {
            console.error("Error when trying to buy some coin: ", e);
        }
    }
</script>

<div style="text-align: center;">
    <p>Your wallet has emitted {co2_emit} grams of CO2.</p>
    <p>You can refund your impact by buying some CO3 that will be used to support so environmental organization.</p>
    <p> How much do you want to refund ?</p>
    <button class="custom-button" on:click={() => buy_CO3(co2_emit * cost_grams).then()}>100%</button>
<button class="custom-button" on:click={() => buy_CO3((co2_emit + co2_emit * 0.5) * cost_grams)}>150%</button>
<button class="custom-button" on:click={() => buy_CO3(co2_emit * 2 * cost_grams)}>200%</button>

</div>