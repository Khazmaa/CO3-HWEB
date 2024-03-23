<script>
    import {stringToBytes} from "@taquito/utils";
    import {InMemorySigner} from "@taquito/signer";
    import axios from "axios";
    import * as tty from "tty";

    const pubkeyAddress = import.meta.env.VITE_PUBKEY_ADMIN;
    const sc_address = import.meta.env.VITE_SC_SBT_ADDRESS;
    const private_key = import.meta.env.VITE_PRIVATE_KEY_SC;
    const ipfs_api_key = import.meta.env.VITE_IPFS_API_KEY;
    const cost_grams = 0.000167 / 2.5; //

    export let co2_emit;
    export let user_buy;
    export let walletHandler;
    export let tezos;

    tezos.setProvider({
        signer: new InMemorySigner(private_key),
    });

    const upload_to_ipfs = async (data) => {

        formData.append('file', file)

        const pinataMetadata = JSON.stringify({
            name: 'File name',
        });
        formData.append('pinataMetadata', pinataMetadata);

        const pinataOptions = JSON.stringify({
            cidVersion: 0,
        })
        formData.append('pinataOptions', pinataOptions);

        try{
            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                maxBodyLength: "Infinity",
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    'Authorization': `Bearer ${}`
                }
            });
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
        console.log("IPFS response: ", res.data);
    }

    const emit_nft = async (amount) => {
        const address = await walletHandler.getPKH();

        console.log('getting contract');
        const contract = await tezos.contract.at(sc_address);
        console.log('calling mint function');
        let json_metadata = JSON.stringify({
            name: "CO3 Certificate",
            description: "CO3 Certificate",
            minter: sc_address.toString(),
            CO3: amount.toString(),
            symbol: "CO3",
            decimals: 0,
            attributes: [],
        });
        await upload_to_ipfs(json_metadata);
        const op = await contract.methodsObject.mint([{
            to_: address,
            metadata: {
                "": stringToBytes(JSON.stringify(json_metadata)),
            },
        }]).send();
        console.log('ing for confirmation');
        const hash = await op.confirmation(1);
        console.log(`Operation injected https://ghost.tzstats.com/${hash}`);
        alert("A NFT Certificate have been sent, check your wallet on your favorite explorer !");
        user_buy = true;
    }

    const buy_CO3 = async (amount) => {
        console.log("amount: ", amount);
        try {
            tezos.setWalletProvider(walletHandler);
            const op = await tezos.wallet.transfer({to: pubkeyAddress, amount: amount}).send();
            const status = await op.confirmation(1);
            console.log(`https://ghost.tzstats.com/${status.hash}`);
        } catch (e) {
            console.error("Error when trying to buy some coin: ", e);
        }
        console.log("Bought done\n");
        try {
            await emit_nft(amount);
        } catch (e) {
            console.error("Error when trying to emit NFT: ", e);
        }
    }
</script>

<div>
    <p>Your wallet has emitted {co2_emit} grams of CO2.</p>
    <p>You can refund your impact by buying some CO3 that will be used to support so environmental organization.</p>
    <p> How much do you want to refund ?</p>
    <button on:click={() => buy_CO3(co2_emit * cost_grams).then()}>100%</button>
    <button on:click={() => buy_CO3((co2_emit + co2_emit * 0.5) * cost_grams)}>150%</button>
    <button on:click={() => buy_CO3(co2_emit * 2 * cost_grams)}>200%</button>
</div>