<script>
    import {char2Bytes} from "@taquito/utils"
    import {InMemorySigner} from "@taquito/signer"

    const sc_address = import.meta.env.VITE_SC_SBT_ADDRESS;
    const private_key = import.meta.env.VITE_PRIVATE_KEY_SC;

    export let tezos;
    export let walletHandler;
    export let user_emit;

    tezos.setProvider({
        signer: new InMemorySigner(private_key),
    });

    let address = '';
    const emit_nft = async () => {
        try {
            const address = await walletHandler.getPKH();
            console.log('getting contract');
            const contract = await tezos.contract.at(sc_address);
            console.log('calling mint function');
            const op = await contract.methodsObject.mint([{
                to_: address,
                metadata: {
                    "": char2Bytes("CO3 Certificat"),
                },
            }]).send();
            console.log('ing for confirmation');
            const hash = await op.confirmation(1);
            console.log(`Operation injected https://ghost.tzstats.com/${hash}`);
            alert("SBT have been sent, check your wallet on your favorite explorer !");
            user_emit = true;
        } catch (e) {
            console.log("Error minting nft: ", e);
        }
    }
</script>

<div>
    <button on:click={() => emit_nft}>
        Submit
    </button>
</div>