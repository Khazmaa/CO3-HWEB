<script>

    import axios from 'axios';
    // Déclaration des variables
    let address = '';
    export let nbr_tx;

    async function fetchTransactionsCount(address) {
        const url = `https://api.ghostnet.tzkt.io/v1/accounts/${address}/operations`;
        console.log("url = ", url);
        try {
            const axiosResponse = await axios.get(url);
            nbr_tx = axiosResponse.data.length;
            console.log('nbr tx =', nbr_tx);
        } catch (e) {
            console.error("error occurred when fetching tx: ", e);
        }
    }

    // Fonction pour gérer la soumission du formulaire
    function handleSubmit() {
        if (!address) {
            alert('Veuillez entrer une adresse Tezos valide.');
            return;
        }
        fetchTransactionsCount(address);
    }
</script>

<div>
    {#key nbr_tx}
    <input type="text" bind:value={address} placeholder="Entrez votre adresse Tezos ici">
    <button on:click={handleSubmit}>Vérifier le nombre de transactions</button>
    <p> Nbr tx: {nbr_tx}</p>
    {/key}
</div>
  