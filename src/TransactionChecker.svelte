<script>

    import axios from 'axios';

    const GR_PER_TX = 2.5; //source: https://tezos.com/carbon/
    let address = '';
    export let nbr_tx;
    export let co2_emit;
    export let user_check;
    export let walletHandler;
    let status = true;

    const fetchTransactionsCount = async () => {
        const address = await walletHandler.getPKH();
        const url = `https://api.ghostnet.tzkt.io/v1/accounts/${address}/operations`;
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
        nbr_tx = await fetchTransactionsCount();
    };

    const handleClick = () => {
        user_check = true;
    };
</script>

<div style="text-align: center;">
    
    {#if status}
    
        <button class="custom-button impact-button" on:click={handleSubmit}>Check your impact!</button>
   
    {/if}
    {#if !status}
        <p>You have processed {nbr_tx} transactions for a total of {co2_emit}g of CO2.</p>
        <button on:click={handleClick}>Neutralize your environmental impact!</button>
    {/if}
</div>
    

  