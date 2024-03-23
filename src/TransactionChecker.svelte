<script>

    import axios from 'axios';

    const GR_PER_TX = 2.5; //source: https://tezos.com/carbon/
    let address = '';
    export let nbr_tx;
    export let co2_emit;

    const fetchTransactionsCount = async (address) => {
        const url = `https://api.ghostnet.tzkt.io/v1/accounts/${address}/operations`;
        console.log("url = ", url);
        try {
            const axiosResponse = await axios.get(url);
            nbr_tx = axiosResponse.data.length;
            co2_emit = nbr_tx * GR_PER_TX;
            console.log('nbr tx =', nbr_tx);
        } catch (e) {
            console.error("error occurred when fetching tx: ", e);
        }
    }

    const handleSubmit = async () => {
        if (!address) {
            alert('Veuillez entrer une adresse Tezos valide.');
            return;
        }
        await fetchTransactionsCount(address);
    }
</script>

<div>
    {#key nbr_tx}
        <input type="text" bind:value={address} placeholder="Entrez votre adresse Tezos ici">
        <button on:click={handleSubmit}>Vérifier le nombre de transactions</button>
        <p> Nbr tx: {nbr_tx}</p>
        <p>Co2 emit: {co2_emit}</p>
    {/key}
</div>
  