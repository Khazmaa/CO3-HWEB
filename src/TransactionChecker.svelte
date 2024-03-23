<script>
    
    import axios from 'axios';
    // Déclaration des variables
    let address = '';
    export let nbr_tx;

    const fetchTransactionsCount = async (address) => {
        const url = `https://api.ghostnet.tzkt.io/v1/accounts/${address}/operations`;
        console.log("url = ", url);
        try {
            const axiosResponse = await axios.get(url);
            let tmp_tx = axiosResponse.data.length;
            return tmp_tx;
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
        nbr_tx = await fetchTransactionsCount(address);
    }
</script>

<div>
    {#key nbr_tx}
    <input type="text" bind:value={address} placeholder="Entrez votre adresse Tezos ici">
    <button on:click={handleSubmit}>Vérifier le nombre de transactions</button>
    <p> Nbr tx: {nbr_tx}</p>
    {/key}
</div>
  