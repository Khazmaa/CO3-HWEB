<script>

    import axios from 'axios';

    const GR_PER_TX = 2.5; //source: https://tezos.com/carbon/
    let address = '';
    export let nbr_tx;
    export let co2_emit;
    export let user_check;

    let status = true;

    const fetchTransactionsCount = async (address) => {
        const url = `https://api.ghostnet.tzkt.io/v1/accounts/${address}/operations`;
        console.log("url = ", url);
        try {
            const axiosResponse = await axios.get(url);
            co2_emit = axiosResponse.data.length * GR_PER_TX;
            status = false;
            return axiosResponse.data.length;
        } catch (e) {
            console.error("error occurred when fetching tx: ", e);
        }
    };

    const handleSubmit = async () => {
        if (!address) {
            alert('Please provide an address.');
            return;
        }
        nbr_tx = await fetchTransactionsCount(address);
    };

    const handleClick = () => {
        user_check = true;
    };
</script>

<div>
    {#if status}
        <input type="text" bind:value={address} placeholder="Enter your tezos address here">
        <button on:click={handleSubmit}>Submit</button>
    {/if}
    {#if !status}
        <p>You have processed {nbr_tx} transactions for a total of {co2_emit}g of CO2.</p>
        <button on:click={handleClick}>Neutralize your environmental impact!</button>
    {/if}
</div>
  