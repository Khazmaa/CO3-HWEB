<script>
    import TransactionChecker from './TransactionChecker.svelte';
    import BuyPoint from "./BuyPoint.svelte";


    let nbr_tx = 0;
    let co2_emit = 0;
    let user_check = false;
    let user_buy = false;
    export let walletHandler;
    export let tezos;
</script>

<div>
    {#if walletHandler}
        {#if !user_check && !user_buy}
            <TransactionChecker bind:nbr_tx={nbr_tx} bind:co2_emit={co2_emit} bind:user_check={user_check}
                                walletHandler={walletHandler}/>
        {/if}
        {#if user_check && !user_buy}
            <BuyPoint bind:user_buy={user_buy} {co2_emit} {walletHandler} {tezos}/>
        {/if}
        {#if user_check && user_buy}
            <p>Transaction completed ! Thanks again for your support!</p>
        {/if}
    {/if}
    {#if !walletHandler}
        <p>Please connect your wallet !</p>
    {/if}
</div>