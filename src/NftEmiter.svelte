<script>
    import { TezosToolkit, MichelsonMap } from "@taquito/taquito";
    import { char2Bytes } from "@taquito/utils"
    import { InMemorySigner, importKey } from "@taquito/signer"

    const sc_address = import.meta.env.VITE_SC_ADDRESS;

    const tezos = new TezosToolkit(' https://ghostnet.ecadinfra.com');
    const private_key = import.meta.env.VITE_PRIVATE_KEY_SC;
    tezos.setProvider({
        signer: new InMemorySigner(private_key),
    });

    let address = '';
    const emit_nft = async (address) => {
        if (!address) {
            alert('Please provide an address.');
            return;
        }
        try {
            console.log('getting contract');
            const contract = await tezos.contract.at(sc_address);
            console.log('calling mint function');
            const op = await contract.methodsObject.mint([{
                to_: address,
                metadata: {
                    "CO3" : char2Bytes("CO3 Certificate"),
                },
            }]).send();
            console.log('ing for confirmation');
            const hash = await op.confirmation(1);
            console.log(`Operation injected https://ghost.tzstats.com/${hash}`);
            alert("SBT have been sent, check your wallet on your favorite explorer !");
        } catch (e) {
            console.log("Error minting nft: ", e);
        }
    }
</script>

<div>
    <input type="text" bind:value={address} placeholder="Choose the address you want to receive your NFT on.">
    <button on:click={() => emit_nft(address)}>
        Submit
    </button>
</div>